function compara(ingredienteArr) {
    var iguaisArr = [];

    for (var i = 0; i < ingredienteArr.length; i++) {
        var value = ingredienteArr[i];
        if (ingredienteArr.indexOf(value) !== -1) {
            iguaisArr.push(value);
        }
    }

}
//========================================//
var reportRecipients = ['AAA', 'XYZ', 'AAA', 'ABC', 'XXX', 'XYZ', 'PQR'];
var recipientsArray = reportRecipients.sort();

var reportRecipientsDuplicate = [];
for (var i = 0; i < recipientsArray.length - 1; i++) {
    if (recipientsArray[i + 1] == recipientsArray[i]) {
        reportRecipientsDuplicate.push(recipientsArray[i]);
    }
}