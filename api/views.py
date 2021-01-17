from django.shortcuts import render
from django.contrib import messages
from model.Predict import predict_model

# Create your views here.
def index(request):
    list_query = ''
    return render(request, 'api/index.html', {'query':list_query})
    
def results(request):
    result = request.GET['query']
    message = {}
    if result == '':
        message = {'error':'Empty Query'} 
    else:
        result = predict_model(result)
        message = {'result':result}
    return render(request, 'api/index.html', message)