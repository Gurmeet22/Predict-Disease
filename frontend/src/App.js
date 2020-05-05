import React, { Component } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';
require('dotenv').config();

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            formData: {
                age: 0,
                sex: 0,
                cigsPerDay: 0,
                sysBP: 0,
                totChol: 0,
                glucose: 0
            },
            result: ""
        };
    }

    handleChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        var formData = this.state.formData;
        formData[name] = value;
        this.setState({
            formData
        });
    }

    handlePredictClick = (event) => {
        const formData = this.state.formData;
        this.setState({ isLoading: true });
        fetch(process.env.API_URL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    result: response.result,
                    isLoading: false
                });
            });
    }

    handleCancelClick = (event) => {
        this.setState({
            isLoading: false,
            formData: {
                age: 0,
                sex: 0,
                cigsPerDay: 0,
                sysBP: 0,
                totChol: 0,
                glucose: 0
            },
            result: ""
        });
    }

    render() {
        const isLoading = this.state.isLoading;
        const formData = this.state.formData;
        const result = this.state.result;
        var gender = [];
        gender.push(<option key="male"
            value="1" > Male </option>);
        gender.push(<option key="female"
            value="0" > Female </option>);
        return (
            <Container>
                <div >
                    <h1 className="title" > Heart Disease Predictor </h1>
                </div>
                <div className="content">
                    <Form >
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label> Age </Form.Label>
                                <Form.Control type="number"
                                    value={formData.age}
                                    name="age"
                                    onChange={this.handleChange} >
                                </Form.Control>
                            </Form.Group >
                            <Form.Group as={Col} >
                                <Form.Label > Gender </Form.Label>
                                <Form.Control as="select"
                                    value={formData.sex}
                                    name="sex"
                                    onChange={this.handleChange}>
                                    {gender}
                                </Form.Control>
                            </Form.Group >
                        </Form.Row>
                        <Form.Row >
                            <Form.Group as={Col} >
                                <Form.Label > Cigarettes per day </Form.Label>
                                <Form.Control type="number"
                                    value={formData.cigsPerDay}
                                    name="cigsPerDay"
                                    onChange={this.handleChange}>
                                </Form.Control>
                            </Form.Group >
                            <Form.Group as={Col} >
                                <Form.Label > Total Cholestrol(mg / dL) </Form.Label>
                                <Form.Control type="number"
                                    step="0.1"
                                    value={formData.totChol}
                                    name="totChol"
                                    onChange={this.handleChange} >
                                </Form.Control>
                            </Form.Group >
                        </Form.Row>
                        <Form.Row >
                            <Form.Group as={Col} >
                                <Form.Label > Systolic Blood Pressure(mmHg) </Form.Label>
                                <Form.Control type="number"
                                    step="0.1"
                                    value={formData.sysBP}
                                    name="sysBP"
                                    onChange={this.handleChange} >
                                </Form.Control>
                            </Form.Group >
                            <Form.Group as={Col} >
                                <Form.Label > Glucose(mg / dL) </Form.Label>
                                <Form.Control type="number"
                                    step="0.1"
                                    value={formData.glucose}
                                    name="glucose"
                                    onChange={this.handleChange} >
                                </Form.Control>
                            </Form.Group >
                        </Form.Row>
                        <Row >
                            <Col >
                                <Button block variant="success"
                                    disabled={isLoading}
                                    onClick={!isLoading ? this.handlePredictClick : null}>
                                    {isLoading ? 'Making prediction' : 'Predict'}
                                </Button>
                            </Col >
                            <Col >
                                <Button block variant="danger"
                                    disabled={isLoading}
                                    onClick={this.handleCancelClick} >
                                    Reset prediction
                            </Button>
                            </Col >
                        </Row>
                    </Form > {
                        result === "" ? null :
                            (<Row >
                                <Col className="result-container" >
                                    <h5 id="result" > {result} </h5>
                                </Col >
                            </Row>)
                    }
                </div>
            </Container >
        );
    }
}

export default App;