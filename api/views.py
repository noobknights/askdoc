from django.shortcuts import render
from django.contrib import messages
from model.Predict import predict_model, predict_button
from json import dumps
import requests
import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

env_path = Path('../hacnitp')/'.env'
load_dotenv(dotenv_path=env_path)

# Create your views here.
def index(request):
    list_query = ''
    return render(request, 'api/index.html', {'query':list_query})
    
def results(request):
    result = request.GET['query']
    message = {}
    docs = get_docs(request.GET['clocation'])
    if result == '':
        message = {'error':'Empty Query'} 
    else:
        if request.GET['isquery'] == 'true':
            result = predict_button(result)
        else:
        	result = predict_model(result)
        message = {'result':result, 'result1':dumps(docs)}
    return render(request, 'api/index.html', message)

def get_docs(location):
    url = "https://places.ls.hereapi.com/places/v1/browse?in="+str(location)+";r=5000&apiKey="+str(os.getenv('MAP_API_KEY'))+"&cat=hospital"
    response = requests.request("GET", url, headers={}, data={})
    return response.json()
    