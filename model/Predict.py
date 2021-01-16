import pickle 
import numpy as np
from nltk.tokenize import word_tokenize
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

RANDOM_FOREST_PATH = str(BASE_DIR)+'/randomforest.pickle'
SYMPTOMS_DICT_PATH = str(BASE_DIR)+'/symptoms_dict.pickle'
WORD_FEATURES_PATH = str(BASE_DIR)+'/word_features.pickle'

load_model=pickle.load(open(RANDOM_FOREST_PATH,'rb'))
symptoms_dict=pickle.load(open(SYMPTOMS_DICT_PATH,'rb'))
word_features=pickle.load(open(WORD_FEATURES_PATH,'rb'))

input_vector = np.zeros(len(symptoms_dict))

def find_feature(document):
    words=word_tokenize(document)
    for w in words:
        if(w in word_features):
            input_vector[symptoms_dict[w]]=1
    return input_vector    

def predict_model(user_input):
    return load_model.predict([find_feature(user_input)])