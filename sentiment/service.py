"""
Sentiment Analysis Service for QLKH
Uses underthesea for Vietnamese NLP with keyword-based fallback.
"""
import logging
import re

logger = logging.getLogger(__name__)

# ─── Vietnamese Sentiment Lexicon ─────────────────────────────────────────────
POSITIVE_WORDS = {
    'tốt', 'tuyệt', 'xuất sắc', 'hài lòng', 'thích', 'yêu thích', 'đẹp',
    'nhanh', 'chuyên nghiệp', 'uy tín', 'chất lượng', 'tuyệt vời', 'hoàn hảo',
    'đúng hẹn', 'nhiệt tình', 'chu đáo', 'tốt bụng', 'thân thiện', 'vui',
    'hạnh phúc', 'tuyệt hảo', 'ổn', 'ok', 'được', 'hay', 'giỏi', 'nổi bật',
    'ấn tượng', 'đáng tin', 'hiệu quả', 'tiết kiệm', 'rẻ', 'hợp lý',
    'nhanh chóng', 'tiện lợi', 'dễ dàng', 'rõ ràng', 'minh bạch',
}
NEGATIVE_WORDS = {
    'tệ', 'xấu', 'kém', 'thất vọng', 'chậm', 'trễ', 'lỗi', 'hỏng',
    'không hài lòng', 'bực', 'khó chịu', 'phàn nàn', 'khiếu nại',
    'không đúng', 'sai', 'dối', 'lừa', 'đắt', 'mắc', 'tốn', 'lãng phí',
    'vô dụng', 'không hiệu quả', 'thô lỗ', 'thiếu chuyên nghiệp', 'bỏ bê',
    'quên', 'mất', 'thất thoát', 'rủi ro', 'nguy hiểm', 'không ổn',
    'bất tiện', 'khó', 'phức tạp', 'rắc rối', 'chán', 'buồn',
}
NEGATION_WORDS = {'không', 'chẳng', 'chưa', 'chả', 'không hề', 'chưa hề', 'ko'}
INTENSIFIER_WORDS = {'rất', 'vô cùng', 'cực kỳ', 'cực', 'quá', 'siêu', 'hết sức'}


def _normalize_text(text: str) -> str:
    """Lowercase, remove punctuation, normalize whitespace."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text


def _keyword_sentiment(text: str) -> tuple[str, float]:
    """
    Rule-based Vietnamese sentiment analysis.
    Returns (label, score) where score in [-1.0, 1.0].
    """
    normalized = _normalize_text(text)
    words      = normalized.split()
    score      = 0.0
    i          = 0

    while i < len(words):
        word = words[i]
        # Check multi-word phrases first (2-word)
        bigram = ' '.join(words[i:i+2]) if i + 1 < len(words) else ''

        negated    = (i > 0 and words[i - 1] in NEGATION_WORDS)
        intensified = (i > 0 and words[i - 1] in INTENSIFIER_WORDS)
        multiplier = 1.5 if intensified else 1.0

        match_word = bigram if bigram in POSITIVE_WORDS or bigram in NEGATIVE_WORDS else word

        if match_word in POSITIVE_WORDS:
            delta = 1.0 * multiplier
            score += -delta if negated else delta
            if bigram == match_word:
                i += 2
                continue
        elif match_word in NEGATIVE_WORDS:
            delta = 1.0 * multiplier
            score += delta if negated else -delta
            if bigram == match_word:
                i += 2
                continue
        i += 1

    # Clamp score to [-3, 3] then normalise to [-1, 1]
    clamped = max(-3.0, min(3.0, score))
    normalized_score = round(clamped / 3.0, 4)

    if normalized_score > 0.15:
        label = 'positive'
    elif normalized_score < -0.15:
        label = 'negative'
    else:
        label = 'neutral'

    return label, normalized_score


def _underthesea_sentiment(text: str) -> tuple[str, float]:
    """
    Try underthesea sentiment analysis.
    Falls back to keyword method on ImportError.
    """
    try:
        from underthesea import sentiment as uts_sentiment  # type: ignore
        result = uts_sentiment(text)
        # underthesea returns: 'positive', 'negative', 'neutral'
        label = str(result).lower()
        if label not in ('positive', 'negative', 'neutral'):
            label = 'neutral'
        score_map = {'positive': 0.75, 'negative': -0.75, 'neutral': 0.0}
        return label, score_map[label]
    except (ImportError, Exception) as e:
        logger.debug(f"underthesea unavailable ({e}), using keyword fallback.")
        return _keyword_sentiment(text)


def analyze_sentiment(text: str) -> dict:
    """
    Main entry point for sentiment analysis.

    Args:
        text: Vietnamese text to analyze.

    Returns:
        dict with keys: label, score, method
    """
    if not text or not text.strip():
        return {'label': '', 'score': None, 'method': 'none'}

    try:
        label, score = _underthesea_sentiment(text)
        method = 'underthesea'
    except Exception:
        label, score = _keyword_sentiment(text)
        method = 'keyword'

    # Validate with keyword method as secondary confirmation
    kw_label, kw_score = _keyword_sentiment(text)
    # If underthesea says neutral but keywords strongly disagree, trust keywords
    if method == 'underthesea' and label == 'neutral' and abs(kw_score) > 0.3:
        label = kw_label
        score = kw_score
        method = 'keyword_override'

    return {
        'label':  label,
        'score':  round(score, 4) if score is not None else None,
        'method': method,
    }


def batch_analyze(customers_qs) -> int:
    """
    Run sentiment analysis on all customers with feedback but no label.
    Returns count of updated records.
    """
    from customers.models import Customer  # avoid circular import

    qs = customers_qs.filter(feedback__gt='', sentiment_label='')
    updated = 0
    for customer in qs.iterator(chunk_size=100):
        result = analyze_sentiment(customer.feedback)
        customer.sentiment_label = result['label']
        customer.sentiment_score = result['score']
        customer.save(update_fields=['sentiment_label', 'sentiment_score', 'updated_at'])
        updated += 1

    logger.info(f"Sentiment batch: {updated} customers analysed.")
    return updated
