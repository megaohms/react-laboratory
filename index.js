import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import TextField from 'material-ui/TextField';
import axios from 'axios';

const flexColumn = {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial'
};

const wrapper = {...flexColumn,
    marginTop: '25vh',
};

// for mocking, im using JSON Placeholder
// a fake REST API server (and website) which responds to your requests
// more info on the site:
// https://jsonplaceholder.typicode.com/
const root = 'https://jsonplaceholder.typicode.com';

let sampleQuestions = [{
    id: 1,
    question: 'What is your favorite color?',
    answer: ' '
}, {
    id: 2,
    question: 'What city do you live in?',
    answer: ' '
}, {
    id: 3,
    question: 'What is your favorite travel destination?',
    answer: ' '
}];

class App extends Component {
    state = {
        currentQuestion: {},
        idx: 0
    };

    componentDidMount = () => {
        axios.get(root + `/users`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(response => {
                const currentQuestion = sampleQuestions[this.state.idx];
                this.setState({ currentQuestion });
            })
            .catch(err => {
                console.log(err);
            });
    };

    componentWillUnmount = () => {
        const currentQuestion = {};
        this.setState({ currentQuestion });
    };

    handleChange = (event) => {
        let currentQuestion = this.state.currentQuestion;
        currentQuestion.answer = event.target.value;
        this.setState({ currentQuestion });
    };

    submit = () => {
        axios.post(root + '/posts', { ...this.state.currentQuestion })
            .then(response => {
                let idx;
                let currentQuestion;
                if (this.state.idx + 1 < sampleQuestions.length) {
                    idx = this.state.idx + 1;
                    currentQuestion = sampleQuestions[idx];
                }
                else {
                    idx = -1;
                    currentQuestion = {
                        question: "Thank you",
                        answer: ' '
                    }
                }
                this.setState({ currentQuestion, idx });
            })
            .catch(err => {
                console.log(err);
            });
    };


    render() {
        let display = null;
        if (this.state.idx > -1) {
            display = <div style={flexColumn}>
                <TextField value={ this.state.currentQuestion.answer } onChange={ this.handleChange }
                           name="answer"/>
                <FlatButton onClick={ this.submit } label='Submit'/>
            </div>
        }
        return (
            <MuiThemeProvider>
                <div style={wrapper}>
                    { this.state.currentQuestion.question }
                    { display }
                </div>
            </MuiThemeProvider>
        );
    }
}


injectTapEventPlugin();
ReactDOM.render(
    <App />,
    document.getElementById('root')
);