def credit_score(transactions):
    # simple model: more transactions = higher score
    base=600
    return min(900, base+len(transactions)*5)
