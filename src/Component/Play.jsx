import React, { useState, useRef, useEffect } from "react";
import '../Style/Play.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

const Play = () => {

    const get_X_Data = () => {
        const x_win = localStorage.getItem('X_wins_count');
        return x_win ? parseInt(x_win, 10) : 0;
    };

    const get_O_Data = () => {
        const o_win = localStorage.getItem("O_wins_count");
        return o_win ? parseInt(o_win, 10) : 0;
    };

    const get_draw_count = () => {
        const draw_count = localStorage.getItem("draw");
        return draw_count ? parseInt(draw_count, 10) : 0;
    };


    const [X_wins_count, set_X_wins_count] = useState(get_X_Data);
    const [O_wins_count, set_O_wins_count] = useState(get_O_Data);
    const [currentPlayer, setCurrentPlayer] = useState('X');

    const [X_wins, set_X_wins] = useState([]);
    const [O_wins, set_O_wins] = useState([]);

    const [draw, set_draw] = useState(get_draw_count);
    const [gameOver, setGameOver] = useState(false);

    const blockRefs = useRef([]);

    const handleRef = (index, element) => {
        blockRefs.current[index] = element;
    };



    useEffect(() => {

        if (X_wins.length >= 3 && checkWin(X_wins)) {
            alert("X Wins");
            set_X_wins_count((X_wins_count) => (X_wins_count + 1));
            setGameOver(true);
        } else if (O_wins.length >= 3 && checkWin(O_wins)) {
            alert("O Wins");
            set_O_wins_count((prev_O_wins_count) => prev_O_wins_count + 1);
            setGameOver(true);
        } else if (X_wins.length + O_wins.length === 9) {
            alert("It's A Draw...");
            set_draw((draw) => draw + 1);
            setGameOver(true);
        }

        // console.log(`X_wins : ${X_wins} -> X_length : ${String(X_wins).length} || O_wins : ${O_wins} -> O_length : ${String(O_wins).length}`);

    }, [X_wins, O_wins])



    useEffect(() => {
        localStorage.setItem('X_wins_count', X_wins_count.toString());
        localStorage.setItem('O_wins_count', O_wins_count.toString());
        localStorage.setItem('draw', draw.toString());
        localStorage.setItem('total', (X_wins_count + O_wins_count + draw).toString());
    }, [X_wins_count, O_wins_count, draw]);


    const winning_condition = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
    ];



    const checkWin = (moves) => {
        for (const condition of winning_condition) {
            if (condition.every(index => moves.includes(index))) {
                console.log("moves : ", moves);
                return true;
            }
        }
        return false;
    };


    const getColorClass = (player) => {
        return player === 'X' ? 'player_X' : 'player_O';
    };


    const handleClick = (index) => {
        const blockElement = blockRefs.current[index];

        if (blockElement.innerHTML === '') {
            const playerClass = getColorClass(currentPlayer);
            console.log("playerClass", playerClass);
            if (currentPlayer === 'X' && !gameOver) {
                blockElement.innerHTML = currentPlayer;
                blockElement.className = `blockText ${playerClass}`;
                setCurrentPlayer('O');
                set_X_wins((X_wins) => [...X_wins, index]);
            } else if (currentPlayer === 'O' && !gameOver) {
                blockElement.innerHTML = currentPlayer;
                blockElement.className = `blockText ${playerClass}`;
                setCurrentPlayer('X');
                set_O_wins((O_wins) => [...O_wins, index]);
            }
        }
    };




    const handleNewGame = () => {
        set_X_wins([]);
        set_O_wins([]);
        setToggle(0);
        setGameOver(false);

        blockRefs.current.forEach((block) => {
            block.innerHTML = '';
        });
    }


    return (
        <div className="play_area">

            <div className="gameName">
                <h4 className="gametext">Tic Tac Toe</h4>
            </div>

            <div className="block_container my-4">
                {Array.from({ length: 9 }).map((_, index) => (
                    <div
                        key={index}
                        className="block"
                        onClick={() => handleClick(index)}
                    >
                        <h3
                            className="blockText"
                            ref={(element) => handleRef(index, element)}
                        >

                        </h3>

                    </div>
                ))}
            </div>

            <div className="btnContainer">
                <Button variant="danger" size="sm" className="my-4 actionBtn" onClick={handleNewGame}>Reset Game</Button>
                <Button variant="success" size="sm" className="my-4 actionBtn" onClick={handleNewGame}>Start New Game</Button>
            </div>

            <div className="blockTable">
                <Table className='table table-bordered table-hover table-sm table-dark my-4'>
                    <thead>
                        <tr>
                            <th>Player X</th>
                            <th>Player O</th>
                            <th>Draw</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{X_wins_count}</td>
                            <td>{O_wins_count}</td>
                            <td>{draw}</td>
                            <td>{X_wins_count + O_wins_count + draw}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default Play;
