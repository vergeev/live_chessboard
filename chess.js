const get_two_dimensional_array = (rows, cols) => Array.from(
    Array(rows), () => new Array(cols)
)

const get_initial_chessboard = () => {
    let chessboard = get_two_dimensional_array(8, 8)
    chessboard[0][0] = piece_ids[0]
    chessboard[0][7] = piece_ids[1]
    chessboard[7][0] = piece_ids[2]
    chessboard[7][7] = piece_ids[3]
    chessboard[0][1] = piece_ids[4]
    chessboard[0][6] = piece_ids[5]
    chessboard[7][1] = piece_ids[6]
    chessboard[7][6] = piece_ids[7]
    chessboard[0][2] = piece_ids[8]
    chessboard[0][5] = piece_ids[9]
    chessboard[7][2] = piece_ids[10]
    chessboard[7][5] = piece_ids[11]
    chessboard[0][3] = piece_ids[12]
    chessboard[7][3] = piece_ids[13]
    chessboard[0][4] = piece_ids[14]
    chessboard[7][4] = piece_ids[15]
    for (let i = 0; i < 8; i++) {
        chessboard[1][i] = piece_ids[16 + i]
        chessboard[6][i] = piece_ids[24 + i]
    }
    return chessboard
}

const show_piece = (piece_id, margin_left, margin_top) => {
    let body_element = document.getElementsByTagName("body")[0]
    let piece_class = piece_id.slice(0, -2)
    let img_url = `img/pieces/${piece_class}.png`
    let image = document.createElement('img')
    image.src = "img/empty.png" // атрибут src не может быть пустым
    image.style.width = "100px"
    image.style.height = "100px"
    image.style.background = `url(${img_url}) no-repeat`
    image.style.backgroundSize = "contain"
    image.style.position = "absolute"
    image.style.marginLeft = `${margin_left}px`
    image.style.marginTop = `${margin_top}px`
    image.id = piece_id
    body_element.appendChild(image)
}

const hide_pieces = () => {
    for (let i = 0; i < piece_ids.length; i++) {
        let piece = document.getElementById(piece_ids[i])
        if (!piece) {
            continue
        }
        piece.parentNode.removeChild(piece)
    }
}

const render_chessboard = (chessboard) => {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (!chessboard[i][j]) {
                continue
            }
            piece_id = chessboard[i][j]
            margin_left = 30 + 90 * j
            margin_top = -810 + 90 * i
            show_piece(piece_id, margin_left, margin_top)
        }
    }
}

const convert_cell_to_coordinates = (turn) => {
    // левый верхний угол A8 -> (0,0).
    // (см. chessboard.jpg)
    const letter_number_map = {
        'A': 0, 'B': 1, 'C': 2, 'D': 3,
        'E': 4, 'F': 5, 'G': 6
    }
    let column_letter = turn[0]
    let reversed_row = parseInt(turn[1])
    let column = letter_number_map[column_letter]
    let row = (reversed_row - 8) * (-1)
    return {'row': row, 'col': column}
}

const display_next_turn = () => {
    if (current_turn >= coordinates.length) {
        next_turn_button.disabled = true
        return
    }
    start_row = coordinates[current_turn]["start"]["row"]
    start_col = coordinates[current_turn]["start"]["col"]
    finish_row = coordinates[current_turn]["finish"]["row"]
    finish_col = coordinates[current_turn]["finish"]["col"]
    chessboard[finish_row][finish_col] = chessboard[start_row][start_col]
    chessboard[start_row][start_col] = undefined
    hide_pieces()
    render_chessboard(chessboard)
    current_turn += 1
}

const read_file = (event) => {
    let files = control.files
    let file = files[0] // гарантированно будет ровно один
    reader.readAsText(file)
}

let coordinates = []
const next_turn_button = document.getElementById("next_turn_button")
const control = document.getElementById("game_file")
const turn_description = document.getElementById("turn_description")
let current_turn = 0
const piece_ids = [
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
let chessboard = get_initial_chessboard()
render_chessboard(chessboard)

const reader = new FileReader()
reader.onload = (event) => {
    let contents = event.target.result
    let turns = contents.split("\n") // ожидается, что каждый новый ход на новой строке
    console.log("Ходы: " + turns)
    for (let i = 0; i < turns.length; i++) {
        if (!turns[i]) {
            // Если строка пустая или undefined, пропускаем итерацию
            continue
        }
        let start_cell = turns[i].split(" ")[0]
        let finish_cell = turns[i].split(" ")[1]
        let start_coordinates = convert_cell_to_coordinates(start_cell)
        let finish_coordinates = convert_cell_to_coordinates(finish_cell)
        coordinates.push({"start": start_coordinates, "finish": finish_coordinates})
    }
    next_turn_button.disabled = false
    current_turn = 0
}

next_turn_button.onclick = (event) => {
    display_next_turn()
}


control.addEventListener("change", read_file, false)