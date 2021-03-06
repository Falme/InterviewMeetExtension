//====================
//  VARIABLES
//====================

var windowsLength = 0;
var windowsElements = new Array();
var listOfCalledElementsToPin = new Array();
var canPin = true;

var elementWindowController = '[jscontroller="J3CtX"]';
var elementNameUserController = "[jscontroller='GQnsGd']";
var pinElementsController = '[jscontroller="u36Osd"]';

var contentCameraClass = "p2hjYe";

//==================
//  METHODS
//==================

function Start()
{
    document.styleSheets[0].insertRule(".realocateCamera {"+
        "width: 100% !important; "+
        "height: 100% !important; "+
        "top: 0px !important; }",0);

    document.styleSheets[0].insertRule(".realocateWindow {"+
        "left: 0% !important; "+
        "top: 0px !important; "+
        "float: left; "+
        "position: relative !important; }",0);

    document.styleSheets[0].insertRule(".BodyInterview .xsj2Ff {"+
        "left: 0% !important; "+
        "top: 0px !important; "+
        "float: left; "+
        "position: relative !important; }", 0);

    document.styleSheets[0].insertRule(".BodyInterview .p2hjYe.TPpRNe {"+
        "left: 0px !important; }", 0);
}


function OnNumberWindowsChanged()
{
    windowsLength = document.querySelectorAll(elementWindowController).length;
    windowsElements = document.querySelectorAll(elementWindowController);

    RemoveAllPins();
}

function RemoveAllPins()
{
    if(!canPin)
    {
        for(var a=0; a<document.querySelectorAll(pinElementsController).length; a++)
        {
            document.querySelectorAll(pinElementsController)[a].style.display = "none";
        }
    }
}

function ShowAllPins()
{
    if(canPin)
    {
        for(var a=0; a<document.querySelectorAll(pinElementsController).length; a++)
        {
            document.querySelectorAll(pinElementsController)[a].style.display = "block";
        }
    }
}

function RefreshWindowsFixedUI()
{
    if(listOfCalledElementsToPin.length < 2) return;

    for(var a=0,b=0; a<windowsElements.length; a++)
    {
        var outerWindowElem = document.querySelectorAll(elementWindowController)[a];
        var innerWindowElem = document.querySelectorAll(elementWindowController+' .'+contentCameraClass)[a];

        
        if(a==listOfCalledElementsToPin[0].id || a==listOfCalledElementsToPin[1].id)
        {
            CheckNameAndIndexMatch();

            outerWindowElem.style.width = "50%";
            outerWindowElem.style.height = "100%";
            outerWindowElem.style.top = "0";
            outerWindowElem.style.opacity = "1";
            outerWindowElem.style.display="block";

            outerWindowElem.classList.add("realocateWindow");
            innerWindowElem.classList.add("realocateCamera");
            innerWindowElem.style.left="0px";
            
            b++;
        } else {
            outerWindowElem.style.display="none";
            outerWindowElem.style.width = "0%";
        }
    }
}

window.onresize = function()
{
    RefreshWindowsFixedUI();
}

function RefreshWindowsUI()
{
    for(var a=0; a<windowsElements.length; a++)
        document.querySelectorAll(elementWindowController)[a].style.display="block";
    
    window.dispatchEvent(new Event('resize'));
}

function RemoveAllClasses()
{
    var pinned = document.querySelectorAll('.realocateWindow');
    var cameraPins = document.querySelectorAll('.realocateCamera');

    document.body.classList.remove("BodyInterview");

    for(var a=0; a<pinned.length; a++)
        pinned[a].classList.remove("realocateWindow");

    for(var a=0; a<cameraPins.length; a++)
        cameraPins[a].classList.remove("realocateCamera");
}

function FixUserById(id)
{
    for(var a=0; a<windowsElements.length; a++)
    {
        var elem = document.querySelectorAll(elementWindowController)[a];
        if(a==id)
        {
            elem.style.width = "50%";
            elem.style.height = "100%";
            elem.style.left = positionsForTwoPins[a];
            elem.style.top = "0";
            elem.style.opacity = "1";
        } else {
            elem.style.display="none";
        }
    }
}

function Update()
{
    if(windowsLength != document.querySelectorAll(elementWindowController).length)
        OnNumberWindowsChanged();

    RefreshWindowsFixedUI();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    

    if(message.action == "request_users")
    {
        var responseArray = new Array();
        
        for(var a=0; a<windowsElements.length; a++)
        responseArray[a] = windowsElements[a].querySelectorAll(elementNameUserController)[0].innerHTML;
        
        sendResponse({farewell:responseArray});
    }
    else if(message.action == "fix_user")
    {
        if(document.querySelectorAll(elementWindowController).length > 1)
        {
            OnFixUser(message);
            sendResponse({fixed:true});
        } else 
        {
            sendResponse({fixed:false});
        }

    }
    else if(message.action == "unpin_user")
    { 
        canPin = true;
        listOfCalledElementsToPin = new Array();
        RefreshWindowsUI();
        RemoveAllClasses();
        ShowAllPins();
    }
    return true
});

function OnFixUser(message)
{
    canPin = false;
    if(listOfCalledElementsToPin.length == 2) listOfCalledElementsToPin = new Array();
    listOfCalledElementsToPin.push({id:message.id, userName:GetUserNameByIndex(message.id)});
    
    if(listOfCalledElementsToPin.length == 2)
        document.querySelectorAll('.EIlDfe.T3F3Rd')[0].classList.add("BodyInterview");
        
    RemoveAllPins();
}

function GetUserNameByIndex(index)
{
    var elem = document.querySelectorAll(elementWindowController)[index];
    var selfName = elem.querySelectorAll(elementNameUserController)[0].innerHTML;
    return selfName;
}

function CheckNameAndIndexMatch()
{
    for(var a=0; a<listOfCalledElementsToPin.length; a++)
    {
        if(listOfCalledElementsToPin[a].id >= document.querySelectorAll(elementWindowController).length)
        {
            listOfCalledElementsToPin[a].id = 0;
        }

        var elem = document.querySelectorAll(elementWindowController)[listOfCalledElementsToPin[a].id];
        var selfName = elem.querySelectorAll(elementNameUserController)[0].innerHTML;

        if(listOfCalledElementsToPin[a].userName != selfName)
        {
            var newId = GetUserIdByName(listOfCalledElementsToPin[a]);
            
            if(newId != -1) listOfCalledElementsToPin[a].id = newId;
        }
    }
}

function GetUserIdByName(user)
{
    for(var a=0; a<document.querySelectorAll(elementWindowController).length; a++)
    {
        var elem = document.querySelectorAll(elementWindowController)[a];
        var selfName = elem.querySelectorAll(elementNameUserController)[0].innerHTML;

        if(user.userName == selfName) return a;
    }

    return -1;
}


window.setInterval(Update, 1000);
Start();