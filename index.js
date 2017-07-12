import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';


class App extends Component {
    state = {
        message: ""
    };

    componentDidMount = () => {
        this.setState({ message: "saying hello" });
        axios.get(`http://api.example.com`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            this.setState({ message: "Hello, World!" });
        });
    };

    componentWillUnmount = () => {
        this.setState({ message: "Goodbye, World!" });
    };


    render() {
        return (
            <div>
                { this.state.message }
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);