from flask import Flask, request, jsonify, make_response
from flask_restplus import Api, Resource, fields
from sklearn.externals import joblib
import numpy as np
import sys

flask_app = Flask(__name__)
app = Api(app=flask_app,
          version="1.0",
          title="Heart disease identifier",
          description="Predict heart disease")

name_space = app.namespace('prediction', description='Prediction APIs')

model = app.model('Prediction params',
                  {'age': fields.Integer(required=True,
                                                 description="Age",
                                                 help="Age cannot be blank"),
                   'Sex_male': fields.Integer(required=True,
                                            description="Gender",
                                            help="Gender cannot be blank"),
                   'cigsPerDay': fields.Integer(required=True,
                                              description="Cigarettes per day",
                                              help="Cigarettes per day cannot be blank"),
                   'totChol': fields.Float(required=True,
                                           description="Total Cholestrol (mg/dL)",
                                           help="Total Cholestrol cannot be blank"),
                   'sysBP': fields.Float(required=True,
                                         description="Systolic Blood Pressure (mmHg)",
                                         help="Total Cholestrol cannot be blank"),
                   'glucose': fields.Float(required=True,
                                           description="Glucose (mg/dL)",
                                           help="Total Cholestrol cannot be blank")
                   })

classifier = joblib.load('classifier.joblib')


@name_space.route("/")
class MainClass(Resource):

    def options(self):
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        return response

    @app.expect(model)
    def post(self):
        try:
            formData = request.json
            data = [float(val) for val in formData.values()]
            print(data)
            prediction = classifier.predict(np.array(data).reshape(1, -1))
            print(prediction)
            types = {0: "No Risk",
                     1: "High Risk "}
            response = jsonify({
                "statusCode": 200,
                "status": "Prediction made",
                "result": "10-years risk of future coronary heart disease (CHD): " + types[prediction[0]]
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        except Exception as error:
            return jsonify({
                "statusCode": 500,
                "status": "Could not make prediction",
                "error": str(error)
            })
