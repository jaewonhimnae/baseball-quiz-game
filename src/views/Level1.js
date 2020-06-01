import React, { Component } from 'react';
import { Input, Button, Progress } from "antd";
import { level1 } from '../datas';
import { Link } from 'react-router-dom';

import groundAudio from '../assets/audios/hitTheBall.mp3';
import strikeAudio from '../assets/audios/strike.mp3';
import homerunAudio from '../assets/audios/homerun.wav';
import cryingAudio from '../assets/audios/crying.wav';
import outAudio from '../assets/audios/out.mp3';
import rightAudio from '../assets/audios/right.mp3';
import playballAudio from '../assets/audios/playball.mp3';

class Level1 extends Component {

    state = {
        value: "",
        timeOut: false,
        round: 0,
        timer: 10,
        wrongAnswer: "",
        wrongAnswers: [],
        rightAnswers: [],
        pause: true,
        landingImage: true,
        rightPage: false,
        wrongPage: false,
    }

    startTimeOut = () => {
        this.timeout = setTimeout(() => {
            this.setState({ timeOut: true })
        }, 10000)

        this.interval = setInterval(() => {
            this.setState({ timer: this.state.timer - 1 })
        }, 1000)
    }

    componentDidMount() {
        this.quizInput.focus();

        this.audio = new Audio(homerunAudio)
        this.audio.load()
        this.playAudio()

    }

    componentDidUpdate() {
        if (this.state.timer === 0) {
            clearInterval(this.interval)
        }

        if (this.state.round < level1.length && !this.state.rightPage && !this.state.wrongPage) {
            if ((this.state.timer === 7) && this.state.value.trim() === "") {
                this.audio = new Audio(level1[this.state.round].mp3)
                this.audio.load()
                this.playAudio()
            }

            if (this.state.timeOut) {
                this.timeOutNextRound()
            }

            this.quizInput.focus();
        }

        if (this.retryDiv !== undefined) {
            this.retryDiv.focus();
        }

        if (this.state.round === level1.length && this.state.timer === 9) {

            let audioToplay;
            if (this.state.wrongAnswers >= 3) {
                audioToplay = outAudio
            } else {
                audioToplay = outAudio
            }

            setTimeout(() => {
                this.audio = new Audio(audioToplay)
                this.audio.load()
                this.playAudio()
            }, 2000);
        }

        // if (this.state.rightPage || this.state.wrongPage) {
        //     setTimeout(() => {
        //         this.setState({ rightPage: false, wrongPage: false })
        //     }, 2000);
        // }

    }

    _handleKeyDown = (e) => {
        if (this.state.timer === 10 && e.key === 'Enter' && this.state.pause === true) {
            this.setState({ landingImage: false })
            this.audio = new Audio(playballAudio)
            this.audio.load()
            this.playAudio()

            setTimeout(() => {
                this.setState({ pause: false })
                this.startTimeOut()
            }, 100);
        }
    }

    _handleRetryKeyDown = (e) => {
        if (e.key === 'Enter') {
            setTimeout(() => {
                window.location.reload();
            }, 10);
        }
    }

    playAudio() {
        const audioPromise = this.audio.play()
        if (audioPromise !== undefined) {
            audioPromise
                .then(_ => {
                    console.log("Played Well")
                })
                .catch(err => {
                    console.info(err)
                })
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout)
        clearInterval(this.interval)
    }

    timeOutNextRound = () => {

        this.setState({
            timer: 10, timeOut: false, wrongAnswer: level1[this.state.round].voca,
            round: this.state.wrongAnswers.length === 2 ? level1.length : this.state.round + 1,
            wrongAnswers: this.state.wrongAnswers.concat(level1[this.state.round].voca),
            wrongPage: true
        }, () => {
            setTimeout(() => {
                this.setState({ wrongPage: false })
            }, 2000);
        })

        this.PlayAudioBasedOnSituation(false)

        clearTimeout(this.timeout);
        clearInterval(this.interval)

        this.startTimeOut()

    }

    handleChange = (event) => {
        this.setState({ value: event.target.value })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.pause === true) return null;

        if (!this.state.value.trim()) return console.info("Please Type something first!")

        this.setState({ value: "", wrongAnswer: "" })

        //we need to check if our answer is right or not  
        this.checkMatched()
    }

    PlayAudioBasedOnSituation = (answer) => {

        let audioToPlay;
        if (answer === "right") {
            audioToPlay = rightAudio
        } else {
            audioToPlay = strikeAudio
        }

        this.audio = new Audio(audioToPlay)
        this.audio.load()
        const audioPromise = this.audio.play()
        if (audioPromise !== undefined) {
            audioPromise
                .then(_ => {
                    // autoplay started
                })
                .catch(err => {
                    // catch dom exception
                    console.info(err)
                })
        }
    }

    checkMatched = () => {
        //we need to check whether our answer was right or not 
        //know Tense for the question 
        (level1[this.state.round].voca) === this.state.value ?
            //true 
            this.setState({
                round: this.state.round + 1,
                timer: 10,
                rightPage: true,
                wrongAnswer: "",
                rightAnswers: this.state.rightAnswers.concat(level1[this.state.round].voca)
            }, () => {

                setTimeout(() => {
                    this.setState({ rightPage: false })
                }, 2000);

                this.PlayAudioBasedOnSituation("right")
                //stop the setTimeout and start new setTimeout,  not for setInterval 
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.setState({ timeOut: true })
                }, 10000)
            })
            :
            //false
            this.setState({
                wrongAnswer: level1[this.state.round].voca,
                wrongPage: true,
                round: this.state.wrongAnswers.length === 2 ? level1.length : this.state.round + 1,
                timer: 10,
                wrongAnswers: this.state.wrongAnswers.concat(level1[this.state.round].voca)
            }, () => {

                setTimeout(() => {
                    this.setState({ wrongPage: false })
                }, 2000);

                this.PlayAudioBasedOnSituation("wrong")
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.setState({ timeOut: true })
                }, 10000)
            })
    }

    handleAudio = (event) => {
        event.preventDefault();
        var elm = event.target;
        var audio = document.getElementById('audio');
        var source = document.getElementById('audioSource');
        source.src = elm.getAttribute('data-value')
        audio.load(); //call this to just preload the audio without playing 
        audio.play(); //call this to play the song right away
    }

    render() {
        let { landingImage, rightPage, wrongPage } = this.state;

        if (landingImage) {
            return (
                <div className="landingPageWrapper">
                    <div className="boxWrapper">
                        <div tabIndex="0" className="boxAbove">
                            Braille Baseball
                        </div>
                        <div
                            ref={(input) => { this.quizInput = input; }}
                            onKeyDown={this._handleKeyDown}
                            className="boxBelow"
                            tabIndex="1"
                        >
                            Press Enter to Start
                        </div>
                    </div>
                </div>
            )
        } else if (rightPage) {
            return (
                <div className="rightPageWrapper" />
            )
        } else if (wrongPage) {
            return (
                <div className="wrongPageWrapper" />
            )
        }
        else {
            return (
                <>
                    {this.state.round < level1.length ?
                        <>
                            <div className="gamePageWrapper">
                                <div className="mainBox">
                                    <h1>Vocaburary Game</h1>

                                    <Progress percent={this.state.round / level1.length * 100} status="active" />

                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h2>LEVEL 1</h2>
                                        <h2>{this.state.round}/{level1.length}</h2>
                                    </div>

                                    <span style={{ marginBottom: 0, color: 'grey' }}>Infinitive</span>
                                    <h2>{level1[this.state.round].voca}</h2>

                                    <form style={{ padding: '1rem 0' }} onSubmit={this.handleSubmit}>
                                        <div style={{ display: 'flex' }}>
                                            <Input
                                                name="value"
                                                onChange={this.handleChange}
                                                value={this.state.value}
                                                id="voca"
                                                type="text"
                                                ref={(input) => { this.quizInput = input; }}
                                                onKeyDown={this._handleKeyDown}
                                            />
                                        </div>
                                    </form>

                                    {/* Timer */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Button className={`${this.state.timer <= 8 && 'disabled'}`}>5</Button>
                                        <Button className={`${this.state.timer <= 6 && 'disabled'}`}>4</Button>
                                        <Button className={`${this.state.timer <= 4 && 'disabled'}`}>3</Button>
                                        <Button className={`${this.state.timer <= 2 && 'disabled'}`}>2</Button>
                                        <Button className={`${this.state.timer <= 0 && 'disabled'}`}>1</Button>
                                    </div>

                                </div>
                            </div>
                        </>
                        :
                        <>
                            <div className="reviewPageWrapper">
                                <div className="boxWrapper">
                                    <div tabIndex="0" className="boxAbove">
                                        You got {this.state.rightAnswers.length} home run
                                        </div>
                                    <div
                                        onKeyDown={this._handleRetryKeyDown}
                                        ref={(div) => { this.retryDiv = div; }}
                                        className="boxBelow" tabIndex="1"
                                    >
                                        Press Enter to Try Again
                                    </div>

                                </div>
                            </div>
                        </>
                    }
                </>
            )
        }
    }
}

export default Level1;