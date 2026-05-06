# If underthesea is not installed, it will fallback to a basic rule-based sentiment
try:
    from underthesea import sentiment
    UNDERTHESEA_AVAILABLE = True
except ImportError:
    UNDERTHESEA_AVAILABLE = False

def analyze_sentiment(text):
    """
    Analyze Vietnamese text sentiment using underthesea.
    Returns: 'positive', 'neutral', 'negative'
    """
    if not text:
        return 'neutral'
        
    if UNDERTHESEA_AVAILABLE:
        try:
            res = sentiment(text)
            # underthesea sentiment returns 'positive', 'negative', 'neutral'
            if res in ['positive', 'negative', 'neutral']:
                return res
        except Exception:
            pass

    # Basic fallback rule-based if underthesea is missing
    lower_text = text.lower()
    positive_words = ['tốt', 'tuyệt', 'hay', 'đẹp', 'ngon', 'ok', 'xuất sắc', 'hài lòng']
    negative_words = ['tệ', 'chán', 'dở', 'xấu', 'kém', 'thất vọng']

    pos_count = sum(1 for w in positive_words if w in lower_text)
    neg_count = sum(1 for w in negative_words if w in lower_text)

    if pos_count > neg_count:
        return 'positive'
    elif neg_count > pos_count:
        return 'negative'
    return 'neutral'
