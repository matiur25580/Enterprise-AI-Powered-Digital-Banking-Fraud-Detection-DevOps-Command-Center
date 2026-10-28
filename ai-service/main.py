from fastapi import FastAPI
app=FastAPI()
@app.get('/fraud-score')
def score(amount:float):
 return {'score':10}
