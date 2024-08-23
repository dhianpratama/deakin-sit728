// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        string longDescription;
        uint dueDate;  // Unix timestamp
        bool completed;
    }

    mapping(address => uint) public taskCounts;
    mapping(address => mapping(uint => Task)) public tasks;

    event TaskCreated(
        uint id,
        string content,
        string longDescription,
        uint dueDate,
        bool completed
    );

    event TaskCompleted(
        uint id,
        bool completed
    );

    constructor() public {
        // Example task for testing, can be removed in production
        createTask("Sample task", "This is a sample long description", now + 1 days);
    }

    function createTask(string memory _content, string memory _longDescription, uint _dueDate) public {
        taskCounts[msg.sender] ++;
        uint _taskId = taskCounts[msg.sender];
        tasks[msg.sender][_taskId] = Task(_taskId, _content, _longDescription, _dueDate, false);
        emit TaskCreated(_taskId, _content, _longDescription, _dueDate, false);
    }

    function toggleCompleted(uint _id) public {
        Task storage _task = tasks[msg.sender][_id];
        _task.completed = !_task.completed;
        emit TaskCompleted(_id, _task.completed);
    }

    function getTaskCount() public view returns (uint) {
        return taskCounts[msg.sender];
    }

    function getTask(uint _id) public view returns (uint, string memory, string memory, uint, bool) {
        Task memory _task = tasks[msg.sender][_id];
        return (_task.id, _task.content, _task.longDescription, _task.dueDate, _task.completed);
    }

    function() external payable {
    }
}
