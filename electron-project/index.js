const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron

// SET ENVIRONMENT
process.env.NODE_ENV = 'production'

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function(){
    // Create new window, allow window to access electron
    mainWindow = new BrowserWindow({webPreferences: {
        nodeIntegration: true
    }})
    // Load HTML file into the window
    mainWindow.loadURL(url.format({
        // Passes in file://dirname/mainWindow.html
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Quit app when closed
    mainWindow.on('closed', function(){
        app.quit()
    })

    // Build menu from menu template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    // Insert Menu
    Menu.setApplicationMenu(mainMenu)
})

// Handle New Window
function createAddWindow(){
    // Create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true
        }
    })
    // Load HTML file into the window
    addWindow.loadURL(url.format({
        // Passes in file://dirname/mainWindow.html
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    addWindow.on('close', function(){
        addWindow = null
    })
}

//Catch item:add
ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add', item)
    addWindow.close()
})

// Menu template
const mainMenuTemplate = [
    {
        label:'File',
        submenu: [
            {label: 'Add Item',
            click(){
                createAddWindow()
            }},

            {label: 'Clear Items',
            click(){
                mainWindow.webContents.send('item:clear')
            }},

            {label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click(){
                app.quit()
            }}
        ]
    }
]

// If Mac, add empty object to menu
if (process.platform == 'darwin'){
    mainMenuTemplate.unshift({})
}

// Add developer tools item if not in prod
if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == "darwin" ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}