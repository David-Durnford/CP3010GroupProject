import React, {useState} from 'react';
import {MDBBadge, MDBTable, MDBTableBody, MDBTableHead} from 'mdb-react-ui-kit';

const UserDataDisplay = ({playerData, currentStats, setCurrentStats}) => {
    const [dataLoaded, setDataLoaded] = useState(false);

    if (!playerData) {
        return null;
    }
    let averageScore = currentStats.gamesPlayed ? (currentStats.total / currentStats.gamesPlayed).toFixed(1) : 0;

    if (!dataLoaded){
        fetchScores(playerData, setDataLoaded)
            .then(() => {
                setCurrentStats(JSON.parse(localStorage.getItem("score")));
            })
    }
    return (
        <MDBTable align="middle">
            <MDBTableHead>
                <tr>
                    <th scope="col">Current User</th>
                    <th scope="col">Total Played</th>
                    <th scope="col">Average Score</th>
                    <th scope="col">Perfect Games</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                <tr>
                    <td>
                        <div className="d-flex align-items-center">
                            <img
                                src="https://feedback.seekingalpha.com/s/cache/6a/4e/6a4e1d533d0a585e46bd62f330deb221.png"
                                alt=""
                                style={{width: "45px", height: "45px"}}
                                className="rounded-circle"
                            />
                            <div className="ms-3">
                                <p className="fw-bold mb-1">{playerData.name}</p>
                                <p className="text-muted mb-0">{playerData.email}</p>
                            </div>
                        </div>
                    </td>
                    <td>
                        <MDBBadge color="warning" pill>
                            {currentStats.gamesPlayed}
                        </MDBBadge>
                    </td>
                    <td>
                        <MDBBadge color="warning" pill>
                            {averageScore}
                        </MDBBadge>
                    </td>
                    <td>
                        <MDBBadge color="warning" pill>
                            {currentStats.perfectScore}
                        </MDBBadge>
                    </td>
                </tr>
            </MDBTableBody>
        </MDBTable>
    );
};

const fetchScores = async (playerData, setDataLoaded) => {
    setDataLoaded(true);
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + playerData.token);
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    const scores = await fetch("/score/getScore", requestOptions);
    const scoresJson = await scores.json();
    const scoresData = JSON.stringify(scoresJson.data.score);
    localStorage.setItem("score", scoresData);
};


export default UserDataDisplay;
