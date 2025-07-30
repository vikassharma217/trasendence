// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract TourData {
    struct Tour {
        string tourName;
        string winnerName;
        string runnerupName;
    }

    Tour[] public tours;

    event TourStored(string tourName, string winnerName, string runnerupName);

    function setTour(
        string memory _tourName,
        string memory _winnerName,
        string memory _runnerupName
    ) public {
        tours.push(Tour(_tourName, _winnerName, _runnerupName));
        emit TourStored(_tourName, _winnerName, _runnerupName);
    }

    function getTour(uint index) public view returns (
        string memory, string memory, string memory) {
        Tour memory t = tours[index];
        return (t.tourName, t.winnerName, t.runnerupName);
    }

    function getAllTours() public view returns (uint) {
        return tours.length;
    }
}
