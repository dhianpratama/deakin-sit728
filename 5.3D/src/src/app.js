App = {
  loading: false,
  contracts: {},

  load: async () => {
    // Load app...
    // console.log("app loading...")
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()

    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      console.log('modern ethereum')
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log('legacy web3')
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = web3.eth.accounts[0]
    console.log('Address ', App.account)
    // App.account = (await web3.eth.getAccounts())[0];
    // console.log(App.account)
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON('TodoList.json')
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.web3Provider)
    // console.log(todoList)

    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed()
  },

  render: async () => {
    if (App.loading) {
      console.log('loading and skip')
      return
    }

    App.setLoading(true)

    $('#account').html(App.account)
    await App.renderTasks()

    App.setLoading(false)
  },

  renderTasks: async () => {
    const taskCount = await App.todoList.getTaskCount({from: App.account}) // Get the total number of tasks.
    const $taskList = $('#taskList') // Get the task list container.
    $taskList.empty() // Clear the current task list.
  
    for (var i = 1; i <= taskCount.toNumber(); i++) {
      const task = await App.todoList.getTask(i, {from: App.account}) // Get each task by its ID.
      const taskId = task[0].toNumber() // Get the task ID.
      const taskContent = task[1] // Get the task title.
      const taskDescription = task[2] // Get the task description.
      const taskDueDate = new Date(task[3].toNumber() * 1000).toLocaleDateString() // Convert and format the due date.
      const taskCompleted = task[4] // Get the task completion status.
  
      const $taskCard = $(`
        <div class="card" data-id="${taskId}">
          <div class="card-body">
            <h5 class="card-title">${taskContent}</h5>
            <p class="card-text">${taskDescription}</p>
            <p class="card-text"><small>Due: ${taskDueDate}</small></p>
            <p class="card-text"><small ${taskCompleted ? 'style="color: green;"' : ''}>${taskCompleted ? 'Completed' : 'Not Completed'}</small></p>
          </div>
        </div>
      `) // Create a card element for each task.
  
      $taskCard.click(() => App.showTaskDetail(taskId)) // Add a click event to display task details.
  
      $taskList.append($taskCard) // Append the task card to the task list.
    }
  },
  

  createTask: async () => {
    App.setLoading(true) // Set the application state to loading.
    const content = $('#newTask').val() // Get the task title from the input field.
    const longDescription = $('#newTaskDescription').val() // Get the task description from the textarea.
    const dueDate = new Date($('#newTaskDueDate').val()).getTime() / 1000 // Convert the due date to a timestamp in seconds.
    await App.todoList.createTask(content, longDescription, dueDate, {from: App.account}) // Call the smart contract function to create a task.
    window.location.reload() // Reload the page to refresh the task list.
  },

  showTaskDetail: async (taskId) => {
    App.setLoading(true) // Set the application state to loading.
  
    const task = await App.todoList.getTask(taskId, {from: App.account}) // Get task details by ID.
    const taskContent = task[1] // Get the task title.
    const taskDescription = task[2] // Get the task description.
    const taskDueDate = new Date(task[3].toNumber() * 1000).toLocaleDateString() // Convert and format the due date.
    const taskCompleted = task[4] // Get the task completion status.
  
    $('#detailTaskTitle').html(taskContent) // Display the task title.
    $('#detailTaskDescription').html(taskDescription) // Display the task description.
    $('#detailTaskDueDate').html(`Due: ${taskDueDate}`) // Display the due date.
    $('#detailTaskCompleted')
      .html(taskCompleted ? 'Completed' : 'Not Completed')
      .css('color', taskCompleted ? 'green' : 'red') // Display and style the completion status.
    $('#detailTaskCheckbox')
      .prop('checked', taskCompleted) // Set the checkbox status.
      .off('click')
      .on('click', () => App.toggleCompletedFromDetail(taskId)) // Add a click event to toggle completion status.
  
    $('#taskListView').hide() // Hide the task list view.
    $('#addTaskForm').hide() // Hide the add task form.
    $('#taskDetail').show() // Show the task detail view.
  
    App.setLoading(false) // Set the application state to not loading.
  },
  
  toggleCompletedFromDetail: async (taskId) => {
    App.setLoading(true) // Set the application state to loading.
    await App.todoList.toggleCompleted(taskId, {from: App.account}) // Call the smart contract function to toggle completion status.
    window.location.reload() // Reload the page to refresh the task list.
  },  


  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

$(() => {
  $(window).load(() => {
    App.load()

    $('#btnAddTask').click(() => {
      $('#taskListView').hide()
      $('#taskDetail').hide()
      $('#addTaskForm').show()
    })

    $('#btnBack').click(() => {
      $('#addTaskForm').hide()
      $('#taskDetail').hide()
      $('#taskListView').show()
    })

    $('#btnBackFromDetail').click(() => {
      $('#addTaskForm').hide()
      $('#taskDetail').hide()
      $('#taskListView').show()
    })
  })
})