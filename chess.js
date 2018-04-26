var coordinates = []
var next_turn_button = document.getElementById("next_turn_button");
var control = document.getElementById("game_file");
var turn_description = document.getElementById("turn_description");
var current_turn = 0;
var piece_ids = [
    "black-rook-1","black-rook-2",
    "white-rook-1", "white-rook-2",
    "black-knight-1", "black-knight-2",
    "white-knight-1", "white-knight-2",
    "black-bishop-1", "black-bishop-2",
    "white-bishop-1", "white-bishop-2",
    "black-king-1",
    "white-king-1",
    "black-queen-1",
    "white-queen-1",
    "black-pawn-1", "black-pawn-2", "black-pawn-3", "black-pawn-4",
    "black-pawn-5", "black-pawn-6", "black-pawn-7", "black-pawn-8",
    "white-pawn-1", "white-pawn-2", "white-pawn-3", "white-pawn-4",
    "white-pawn-5", "white-pawn-6", "white-pawn-7", "white-pawn-8",
]

var get_two_dimensional_array = function(rows, cols) {
    var x = new Array(rows);
    for (var i = 0; i < rows; i++) {
        x[i] = new Array(cols);
    }
    return x;
}

var get_initial_chessboard = function() {
    var chessboard = get_two_dimensional_array(8, 8);
    chessboard[0][0] = piece_ids[0];
    chessboard[0][7] = piece_ids[1];
    chessboard[7][0] = piece_ids[2];
    chessboard[7][7] = piece_ids[3];
    chessboard[0][1] = piece_ids[4];
    chessboard[0][6] = piece_ids[5];
    chessboard[7][1] = piece_ids[6];
    chessboard[7][6] = piece_ids[7];
    chessboard[0][2] = piece_ids[8];
    chessboard[0][5] = piece_ids[9];
    chessboard[7][2] = piece_ids[10];
    chessboard[7][5] = piece_ids[11];
    chessboard[0][3] = piece_ids[12];
    chessboard[7][3] = piece_ids[13];
    chessboard[0][4] = piece_ids[14];
    chessboard[7][4] = piece_ids[15];
    for (var i = 0; i < 8; i++) {
        chessboard[1][i] = piece_ids[16 + i];
        chessboard[6][i] = piece_ids[24 + i];
    }
    return chessboard;
}

var show_piece = function(piece_id, margin_left, margin_top) {
    var body_element = document.getElementsByTagName("body")[0];
    var piece_class = piece_id.slice(0, -2);
    var img_url = "img/pieces/" + piece_class + ".png";
    var image = document.createElement('img');
    image.src = "img/empty.png"; // атрибут src не может быть пустым
    image.style.width = "100px";
    image.style.height = "100px";
    image.style.background = "url(" + img_url + ") no-repeat";
    image.style.backgroundSize = "contain";
    image.style.position = "absolute";
    image.style.marginLeft = String(margin_left) + "px";
    image.style.marginTop = String(margin_top) + "px";
    image.id = piece_id;
    body_element.appendChild(image);
}

var hide_pieces = function() {
    for (var i = 0; i < piece_ids.length; i++) {
        var piece = document.getElementById(piece_ids[i]);
        if (!piece) {
            continue;
        }
        piece.parentNode.removeChild(piece);
    }
}

var render_chessboard = function(chessboard) {
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (!chessboard[i][j]) {
                continue;
            }
            piece_id = chessboard[i][j];
            margin_left = 30 + 90 * j;
            margin_top = -810 + 90 * i;
            show_piece(piece_id, margin_left, margin_top);
        }
    }
}

var chessboard = get_initial_chessboard();
render_chessboard(chessboard);

var convert_cell_to_coordinates = function(turn) {
    // левый верхний угол A8 -> (0,0).
    // (см. chessboard.jpg)
    var letter_number_map = {
        'A': 0, 'B': 1, 'C': 2, 'D': 3,
        'E': 4, 'F': 5, 'G': 6
    }
    var column_letter = turn[0];
    var reversed_row = parseInt(turn[1]);
    var column = letter_number_map[column_letter];
    var row = (reversed_row - 8) * (-1);
    return {'row': row, 'col': column};
}

var display_next_turn = function() {
    if (current_turn >= coordinates.length) {
        next_turn_button.disabled = true;
        return;
    }
    start_row = coordinates[current_turn]["start"]["row"];
    start_col = coordinates[current_turn]["start"]["col"];
    finish_row = coordinates[current_turn]["finish"]["row"];
    finish_col = coordinates[current_turn]["finish"]["col"];
    chessboard[finish_row][finish_col] = chessboard[start_row][start_col];
    chessboard[start_row][start_col] = undefined;
    hide_pieces();
    render_chessboard(chessboard);
    current_turn += 1;
}

var reader = new FileReader();
reader.onload = function(event) {
    var contents = event.target.result;
    var turns = contents.split("\n"); // ожидается, что каждый новый ход на новой строке
    console.log("Ходы: " + turns);
    for (var i = 0; i < turns.length; i++) {
        if (!turns[i]) {
            // Если строка пустая или undefined, пропускаем итерацию
            continue;
        }
        var start_cell = turns[i].split(" ")[0];
        var finish_cell = turns[i].split(" ")[1];
        var start_coordinates = convert_cell_to_coordinates(start_cell);
        var finish_coordinates = convert_cell_to_coordinates(finish_cell);
        coordinates.push({"start": start_coordinates, "finish": finish_coordinates})
    }
    next_turn_button.disabled = false;
    current_turn = 0;
    display_next_turn();
}

next_turn_button.onclick = function(event) {
    display_next_turn();
}

var read_file = function(event) {
    var files = control.files;
    var file = files[0]; // гарантированно будет ровно один
    reader.readAsText(file);
}
control.addEventListener("change", read_file, false);