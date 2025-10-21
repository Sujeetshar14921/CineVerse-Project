from bson import ObjectId

def to_objectid(s):
    try:
        return ObjectId(s)
    except Exception:
        return None
