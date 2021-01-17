#!/usr/bin/env python
# coding: utf-8




import pickle 
import numpy as np
import nltk
from nltk.corpus import wordnet
from nltk.tokenize import word_tokenize
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
VOTED_CLASSIFIER_PATH = str(BASE_DIR)+'/voted_classifier.pickle'
SYMPTOMS_DICT_PATH = str(BASE_DIR)+'/symptoms_dict.pickle'
WORD_FEATURES_PATH = str(BASE_DIR)+'/word_features.pickle'




rf_clf=pickle.load(open(VOTED_CLASSIFIER_PATH,'rb'))
symptoms_dict=pickle.load(open(SYMPTOMS_DICT_PATH,'rb'))
word_features=pickle.load(open(WORD_FEATURES_PATH,'rb'))



def similar(word):
    if(word in word_features):
        return word
    else:
        for word_f in word_features:
            if(word_f[:len(word)]==word):
                return word_f    





def predict_model(document):
    input_vector = np.zeros(len(symptoms_dict))
    words=word_tokenize(document)
    for word in words:
        if(word.lower() in word_features):
            input_vector[symptoms_dict[word.lower()]]=1
        elif(similar(word.lower()) in word_features):
            match=similar(word.lower())
            input_vector[symptoms_dict[match]]=1
            
        else:
            for syn in wordnet.synsets(word.lower()):
                  for l in syn.lemmas():
                    if(l.name() in word_features):
                        input_vector[symptoms_dict[l.name()]]=1
    if(1 in input_vector):
        if(rf_clf.predict_proba([input_vector]).max()*100 > 0):
            print({'disease':rf_clf.predict([input_vector])[0],'score':rf_clf.predict_proba([input_vector]).max()*100})
            return {'disease':rf_clf.predict([input_vector])[0],'score':rf_clf.predict_proba([input_vector]).max()*100}
        else:
            return 'Enter more symptoms'
    else:
        return 'Enter valid'


def predict_button(buttons):
    input_vector=np.zeros(len(symptoms_dict))
    buttons=buttons.split(' ')
    for button in buttons:
        input_vector[symptoms_dict[button]]=1
    return {'disease':rf_clf.predict([input_vector])[0],'score':rf_clf.predict_proba([input_vector]).max()*100}










