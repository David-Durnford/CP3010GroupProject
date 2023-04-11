import React from 'react';
import { MDBBadge, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';

const UserDataDisplay = ({ playerData, setPlayerData }) => {

    if (!playerData) {
        return null;
    }

    console.log("UserDataDisplay ..........................................................");
    console.log(playerData);

    const averageScore = playerData.totalPlayed ? (playerData.totalScore / playerData.totalPlayed).toFixed(1) : 0;

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
                                style={{ width: "45px", height: "45px" }}
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
                            {playerData.totalPlayed}
                        </MDBBadge>
                    </td>
                    <td>
                        <MDBBadge color="warning" pill>
                            {averageScore}
                        </MDBBadge>
                    </td>
                    <td>
                        <MDBBadge color="warning" pill>
                            {playerData.perfectGames}
                        </MDBBadge>
                    </td>
                </tr>
            </MDBTableBody>
        </MDBTable>
    );
};

export default UserDataDisplay;
