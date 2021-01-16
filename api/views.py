from django.shortcuts import render
from django.contrib import messages
from model.Predict import predict_model

# Create your views here.
def index(request):
    list_query = ''
    return render(request, 'api/index.html', {'query':list_query})
    
def results(request):
    result = request.GET['query']
    result = predict_model(result)
    return render(request, 'api/index.html', {'result':result})