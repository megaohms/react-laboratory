import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import axios from 'axios';

import './App.css';


class App extends Component {
    state = {
        firstCommitTime: 0,
        lastCommitTime: 0,
        idxLast: 0,
        sumDiffs: 0,
        remainingTime: {
            days: '',
            hours: '',
            minutes: '',
            seconds: ''
        },
        intervalId: 0
    };

    componentDidMount = () => {
        axios.get(`https://api.sidewalklabs.com/codechallenge/commits`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                let idxLastCommit = 0;
                let sumDiffs = 0;
                let firstCommitTime = 0;
                let latestCommitTime = 0;
                response.data.forEach((unix, i) => {
                    // new times are prepended to list, data is descending
                    // reverse slope/intercept for easier estimating (1000th won't be index 0)
                    if (i === response.data.length - 1) {
                        firstCommitTime = unix;
                        idxLastCommit = i;
                    }
                    if (i === 0) {
                        latestCommitTime = unix;
                    }
                    else {
                        const diff = response.data[i - 1] - unix;
                        sumDiffs += diff;
                    }
                });
                this.setState({ firstCommitTime: firstCommitTime, latestCommitTime: latestCommitTime });
                this.calcPath(sumDiffs, idxLastCommit, firstCommitTime, latestCommitTime);
        });
    };

    componentWillUnmount = () => {
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
        }
    };

    calcPath = (sumDiffs, idxLast, firstTime, lastTime, newCommitTime) => {
        let newYestimated = 0;
        if (newCommitTime && isFinite(newCommitTime)) {
            const diff = newCommitTime - lastTime;
            const newSum = sumDiffs + newCommitTime - lastTime;
            const idxNext = idxLast + 1;
            newYestimated = newSum / idxLast * idxNext + firstTime;
            this.setState({ sumDiffs: newSum, idxLast: idxNext, latestCommitTime: newCommitTime });
        }
        else {
            const slope = sumDiffs / idxLast - 1;
            newYestimated = slope * idxLast + firstTime;
            this.setState({ sumDiffs, idxLast });
        }
        this.estimate1000thLinear(newYestimated, firstTime, lastTime, idxLast);
    };

    addNewCommit = () => {
        const now = moment().unix();
        this.calcPath(this.state.sumDiffs, this.state.idxLast, this.state.firstCommitTime, this.state.latestCommitTime, now);
    };

    estimate1000thLinear = (newEstimated, firstTime, lastTime, idxLast) => {
        const diff = newEstimated - firstTime;
        const unix = diff * 999 / idxLast + firstTime;
        this.countDownToThousandth(moment.unix(unix) - moment());
    };

    getTimeUntil = (timeDiff) => {
        var timeUntil = moment.duration(timeDiff);
        var remainingTime = {
            days: Math.floor(timeUntil.as('days')),
            hours: timeUntil.get('hours'),
            minutes: timeUntil.get('minutes'),
            seconds: timeUntil.get('seconds')
        };
        this.setState({ remainingTime });
    };

    countDownToThousandth = (timeDiff) => {
        this.getTimeUntil(timeDiff);
        if (this.state.intervalId) {
            clearInterval(this.state.intervalId);
        }
        var timerId = setInterval(() => {
            timeDiff = timeDiff - 1000;
            this.getTimeUntil(timeDiff);
        }, 1000);
        this.setState({ intervalId: timerId });
    };

    render() {
        if (this.state.sumDiffs) {
            return (
                <div className="commit-countdown-wrapper">
                    <div className="commit-countdown-clock">
                        <div className="commit-countdown-clock-values">
                            <div>{this.state.remainingTime.days}</div>
                            <div>{this.state.remainingTime.hours}</div>
                            <div>{this.state.remainingTime.minutes}</div>
                            <div>{this.state.remainingTime.seconds}</div>
                        </div>
                        <div className="commit-countdown-clock-units">
                            <div>days</div>
                            <div>hours</div>
                            <div>minutes</div>
                            <div>seconds</div>
                        </div>
                    </div>
                    <div className="commit-countdown-clock-until">
                        ...until the 1000th commit!
                    </div>
                    <div className="commit-button" onClick={this.addNewCommit}>Add New Commit</div>
                </div>
            );
        } else {
            return (
                <div className="commit-countdown-wrapper">
                    Loading...
                </div>
            );
        }
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);