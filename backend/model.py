import numpy as np
import pandas as pd
from sklearn import preprocessing 
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix
from sklearn.metrics import jaccard_similarity_score 
from sklearn.externals import joblib


df = pd.read_csv("data.csv") 
df.drop(['education'], inplace = True, axis = 1) 
df.rename(columns ={'male':'Sex_male'}, inplace = True) 

df.dropna(axis = 0, inplace = True) 
print(df.head(), df.shape) 
print(df.TenYearCHD.value_counts()) 


X = np.asarray(df[['age', 'Sex_male', 'cigsPerDay',  'totChol', 'sysBP', 'glucose']]) 
y = np.asarray(df['TenYearCHD']) 
  
X = preprocessing.StandardScaler().fit(X).transform(X) 
  
# Train-and-Test -Split 
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.3, random_state = 4) 
print ('Train set:', X_train.shape,  y_train.shape) 
print ('Test set:', X_test.shape,  y_test.shape) 

classifier = LogisticRegression() 
classifier.fit(X_train, y_train) 
y_pred = classifier.predict(X_test) 
  
print('jaccard similarity score = ',  jaccard_similarity_score(y_test, y_pred)) 

cm = confusion_matrix(y_test, y_pred) 
print('confusion matrix =', cm) 

# Save the model to disk
joblib.dump(classifier, 'classifier.joblib')





