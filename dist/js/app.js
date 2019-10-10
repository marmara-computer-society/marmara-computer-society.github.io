var registerConfig = {
    apiURL: "https://alperen.tech:3001/register",
    type: 'id',
    working: false
};

document.addEventListener('DOMContentLoaded', function (event) {
    document.getElementById('changeType').addEventListener('click', function () {
        toggleType(this);
    });
    document.getElementById('btnRegister').addEventListener('click', function () {
        sendRegisteration();
    });
});

/* Functions */

// Toggles type of registeration and creates necessary visualisations
function toggleType(element) {
    if (registerConfig.working) return; // No toggle allowed during working phase
    if (registerConfig.type === 'id') {
        element.innerText = "Github ID ile kayıt ol.";
        registerConfig.type = 'mail';
        document.getElementById('typeID').style.display = 'none';
        document.getElementById('typeMail').style.display = 'block';
    } else {
        element.innerText = "Pes ettim. Mail adresimle kaydolayım.";
        registerConfig.type = 'id';
        document.getElementById('typeID').style.display = 'block';
        document.getElementById('typeMail').style.display = 'none';
    }
}

function sendRegisteration() {
    if (registerConfig.working) return; // No registeration during working phase
    registerConfig.working = true;
    document.getElementById('btnRegister').classList.add('disabled');
    if (!validateRegisteration()) return;
    var ajax = new XMLHttpRequest();
    var data = (registerConfig.type === 'id') ? document.getElementById('inputID').value : document.getElementById('inputMail').value;
    ajax.open('POST', registerConfig.apiURL);
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    ajax.onload = function () {
        if (ajax.status === 200) {
            pushAlert('Kayıt tamamlandı •ᴗ• {Hoşgeldin!}', 'success');
        } else {
            pushAlert('Sunucu hatalı yanıt döndürdü.<br>İletişim:<a href="mailto:alperenyurdakul7@gmail.com">alperenyurdakul7@gmail.com</a>', 'danger');
        }
    };
    try {
        ajax.send(encodeURI('type=' + registerConfig.type + '&data=' + data));
    } catch (err) {
        pushAlert('Beklenmedi bir hata oluştu.<br>İletişim:<a href="mailto:alperenyurdakul7@gmail.com">alperenyurdakul7@gmail.com</a>', 'danger');
    }
}

function validateRegisteration() {
    if (registerConfig.type === 'mail') {
        if (validateEmail(document.getElementById('inputMail').value)) return true; // Everything seems fine!
        pushAlert("Mail adresi doğru gözükmüyor.", 'danger');
        return false; // Error
    } else if (registerConfig.type === 'id') {
        var re = /^[0-9]*$/;
        if (!re.test(document.getElementById('inputID').value)) {
            pushAlert("Github ID'si sadece sayılardan oluşur.", 'danger');
            return false; // Error
        }
        return true; // Everything seems fine!
    }

    // If this code gets here you know what to do: Panic
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function pushAlert(message, type) { // For alert types see: https://getbootstrap.com/docs/4.0/components/alerts/
    clearAlerts();
    document.getElementById('alerts').innerHTML += '<div class="alert alert-' + type + '" role="alert"> ' + message + ' </div>';
}

function clearAlerts() {
    document.getElementById('alerts').innerHTML = '';
}