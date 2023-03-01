var _Connection
var _UserId = ''
$(function () {
    window.addEventListener('pageshow', (event) => {
        var isBackNavigation = event.persisted || (typeof window.performance != 'undefined' && window.performance.navigation.type === 2)
        if (isBackNavigation) {
            if (_UserId != '')
                window.location.reload()
        }
    })

    $.ajax({
        url: '/' + lang + '/EsaalChattingUrl',
        type: 'Get',
        success: function (tkData) {
            if (tkData.url.trim() == "")
                return
            else {
                _UserId = tkData.userId
                UpdateReadCount(tkData.nonReadCount)
                _Connection = new signalR.HubConnectionBuilder()
                    .withUrl(tkData.url)
                    .build()
                _Connection.start()
                ConnectionCheck()
            }
        }
    })

    $("#btnChats").click(function () {
        $("#divChatNotify").hide(1000)
        $("#mychats").click()
    })
})

function ConnectionCheck() {
    setTimeout(() => {
        if (_Connection.state.toLowerCase() == "disconnected") {
            console.log('status: ' + _Connection.state.toLowerCase() + ' , connectiong to Hub failed')
            return
        }
        if (_Connection.state.toLowerCase() != 'connected') {
            console.log('status: ' + _Connection.state.toLowerCase() + ' , connecting to Hub...')
            ConnectionCheck()
        }
        else {
            console.log('connected to Hub')
            _Connection.invoke("AfterConnected", _UserId, 1, "0")
            _Connection.on('EsaalNotify', function (count) {
                $("#txtMissedChatCount").text(count).show()
                $("#divChatNotify").show(1000)
                setTimeout(() => {
                    $("#divChatNotify").hide(1000)
                }, 10000)
            })
        }
    }, 100)
}

function UpdateReadCount(count) {
    if (count > 0)
        $("#txtMissedChatCount").text(count).show()
    else
        $("#txtMissedChatCount").hide()
}