let gameboard=(function(){
    let board=Array.from(Array(3),()=> new Array(3).fill(0));
    function place(symbol,i,j){
        if(0<=i<3 && 0<=j<3)
        board[i][j]=symbol;
        else
        console.log("Invalid index passed");
    }
    function check(){
        for(i=0;i<3;i++){
            if(board[i][0]!==0 && board[i][0]===board[i][1] && board[i][1]===board[i][2]){
                return {index: i,dir: 1, winner:board[i][0] };
            }
            if(board[0][i]!==0 && board[0][i]===board[1][i]&& board[1][i]===board[2][i]){
                return {index: i,dir: 2, winner: board[0][i]};
            }
        }
        if(board[0][0]!==0 && board[0][0]===board[1][1] && board[1][1]===board[2][2]){
            return {index: 0,dir: 3, winner:board[0][0]};
        }
        if(board[2][0]!==0 && board[2][0]===board[1][1] && board[1][1]===board[0][2]){
            return {index: 0,dir: 4, winner: board[2][0]};
        }
        let draw=1;
        for(i=0;i<3;i++){
            for(j=0;j<3;j++){
                if(board[i][j]===0){
                    draw=0;
                    break;
                }
            }
        }
        if(draw){
            return {index:-1,dir:-1,winner:-1};
        }
        return {index:-1,dir:-1, winner:0};
    }
    function getBoard(){
        let ret=board;
        return ret;
    }
    function getSym(i,j){
        return board[i][j];
    }
    function reset(){
        for(i=0;i<3;i++){
            for(j=0;j<3;j++){
                board[i][j]=0;
            }
        }
    }
    return {place,check,getBoard,getSym,reset};
})();

function makePlayer(name,symbol){
    let score=0;
    return {name,symbol,score};
}

function updateBoard(){
    let temp;
    let s;
    let cells=document.querySelectorAll(".boardcell");
    for(i=0;i<cells.length;i++){
        temp=cells[i].getAttribute("id");
        s=gameboard.getSym(temp.charAt(1),temp.charAt(2));
        if(s!==0)
        cells[i].innerHTML=`<img src="./resources/${s}.svg" width="50px" height="50px">`;
    }

}

function addwin(cell){
    let cellim=cell.children[0];
    cellim.classList.add("winner");
}
function adddraw(cell){
    let cellim=cell.children[0];
    cellim.classList.add("drawer");
}

function colorit(){
    let textbox=document.querySelector(".text");
    let ans=gameboard.check();
    let winner=ans.winner;
    let temp;
    if(winner===-1){
        textbox.style.color="lightgrey";
    }
    else if(winner==='X'){
        textbox.style.color="lightcoral";
    }
    else{
        textbox.style.color="lightblue";
    }
    let cells=document.querySelectorAll(".boardcell");
    cells.forEach((cell)=>{
        temp=cell.getAttribute("id");
        let s=temp.substring(1);
        if(ans.dir===4 && (s==="20" || s==="11" || s==="02")){
            addwin(cell);
        }
        if(ans.dir===3 && (s==="00" || s==="11" || s==="22")){
            addwin(cell);
        }
        if(ans.dir===2 && (temp[2]-'0')===ans.index){
            addwin(cell);
        }
        if(ans.dir===1 && temp[1]===ans.index){
            addwin(cell);
        }
        if(winner===-1){
            adddraw(cell);
        }
    })
}

function uncolorit(){
    let textbox=document.querySelector(".text");
    textbox.style.color="";
    let cells=document.querySelectorAll(".boardcell");
    cells.forEach((cell)=>{
        cell.innerHTML="";
    })
}

function freezeboard(){
    let b=document.querySelector(".board");
    b.replaceWith(b.cloneNode(true));
}


function playGame(p1,p2){
    let turn='X';
    let str = "X goes first, ";
    let textbox=document.querySelector(".text");
    if(p1.symbol==='X'){
        str=str+ `${p1.name}'s turn`;
    }
    else{
        str=str+ `${p2.name}'s turn`;
    }
    textbox.textContent=str;
    let cells=document.querySelectorAll(".boardcell");
    cells.forEach((cell)=>{
        cell.addEventListener("click",function handler(){
            let temp=cell.getAttribute("id");
            let s=gameboard.getSym(temp.charAt(1),temp.charAt(2));
            if(s===0){
                gameboard.place(turn,temp.charAt(1),temp.charAt(2));
                updateBoard();
                if(turn==='X'){
                    turn='O';
                }
                else{turn='X';}
                if(p1.symbol===turn){
                    str=`${p1.name}'s turn`;
                }
                else{
                    str=`${p2.name}'s turn`;
                }
                let chk=gameboard.check();
                if(chk.winner!==0){
                    if(chk.winner===-1){
                        str="Draw";
                    }
                    else if(p1.symbol===chk.winner){
                        p1.score++;
                        str=`${p1.name} wins`;
                    }
                    else{
                        p2.score++;
                        str=`${p2.name} wins`;
                    }
                    textbox.textContent=str+", press reset to play again.";
                    colorit();
                    freezeboard();
                }
                else{
                    textbox.textContent=str;
                }
            }
        })
    })
}

function assignSymbol(){
    if(Math.random()<0.5){
        return {p1:'X',p2:'O'};
    }
    else{
        return {p1:'O',p2:'X'};
    }
}


function main(){

    let p1n=prompt("Enter name of player 1");
    let p2n=prompt("Enter name of player 2");
    let sym=assignSymbol();

    let playerOne=makePlayer(p1n,sym.p1);
    let playerTwo=makePlayer(p2n,sym.p2);

    let p1name=document.querySelector(".p1 figcaption");
    let p2name=document.querySelector(".p2 figcaption");
    p1name.textContent=playerOne.name;
    p2name.textContent=playerTwo.name;

    let p1img=document.querySelector(".p1 div");
    let p2img=document.querySelector(".p2 div");
    p1img.innerHTML=`<img src="./resources/${playerOne.symbol}.svg" width="50px" height="50px">`;
    p2img.innerHTML=`<img src="./resources/${playerTwo.symbol}.svg" width="50px" height="50px">`;


    let board=document.querySelector(".board");
    for(i=0;i<3;i++){
        let newrow=document.createElement("div");
        newrow.classList.add("boardrow");
        for(j=0;j<3;j++){
            let tempb=document.createElement("button");
            tempb.classList.add("boardcell");
            tempb.setAttribute("id","b"+i+j);
            newrow.appendChild(tempb);
        }
        board.appendChild(newrow);
    }

    playGame(playerOne,playerTwo);


    let resetButton=document.querySelector(".reset");
    resetButton.addEventListener("click", ()=>{
        gameboard.reset();
        uncolorit();
        let tempsym=playerOne.symbol;
        playerOne.symbol=playerTwo.symbol;
        playerTwo.symbol=tempsym;
        p1img.innerHTML=`<img src="./resources/${playerOne.symbol}.svg" height="42px" width="auto">`;
        p2img.innerHTML=`<img src="./resources/${playerTwo.symbol}.svg" height="42px" width="auto">`;
        playGame(playerOne,playerTwo);
    });

}

main();