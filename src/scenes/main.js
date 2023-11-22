import { useRef,useState } from 'react';
import './style.css';
import {Node} from '../components/nodes.js';
import { mp } from './walls.js';
export const Main = ()=>{
    //states
    const getDiv = useRef(null);
    const source = useRef(-1);
    const destination = useRef(-1);
    const [btn,setBtn] = useState('');
    // const [walls,setWalls] = useState([]);

    let explore = [];
    const NODES = [];
    for(let i=0;i<36;i++){
        NODES.push(i);
    }

    const INF = 1e9;
    const board = [
        [0,1,2,3,4,5],
        [6,7,8,9,10,11],
        [12,13,14,15,16,17],
        [18,19,20,21,22,23],
        [24,25,26,27,28,29],
        [30,31,32,33,34,35]
    ];
    let path =[];
    let n = board.length;

    let dist = new Array(n*n).fill(INF);
    let desti;
    let src;
    let adj = [];
    for(let i=0;i<n*n;i++){
        adj[i] = [];
    }

    function dijkstra(src){
        let pq = [];
        dist[src] = 0;
        pq.push([0,src]);
        while(pq.length > 0){
            let u = pq[0][1];
            // let track = document.getElementById(u);
            explore.push(u);
            // track.style.backgroundColor = "yellow";
            path.push([[u],[...dist]]);
            pq.shift();
            for(let i=0;i<adj[u].length;i++){
                let v = adj[u][i][0]; 
                let wt = adj[u][i][1];
                if(dist[v] > wt + dist[u]){
                    dist[v] = wt+dist[u];
                    pq.push([dist[v],v]);
                    pq.sort((a,b)=>{
                        if(a[0] == b[0])
                            return a[1] - b[1];
                        return a[0] - b[0]
                    });
                }
            }
        }
    }

    function inBound(x,y){
        if(x<0 || x>=n || y<0 || y>= n)
            return false;
        else
            return true;
    }

    function createEdges(){
        for(let i=0;i<n;i++){
            for(let j=0;j<n;j++){
                if(inBound(i,j+1)){
                    let u=board[i][j],v=board[i][j+1];
                    if(mp[u] === true || mp[v] === true){
                        adj[u].push([v,INF]);
                        adj[v].push([u,INF]);
                    }
                    else{
                        adj[u].push([v,1]);
                        adj[v].push([u,1]);
                    }
                }
                
                if(inBound(i+1,j+1)){
                    let u=board[i][j],v=board[i+1][j+1];
                    if(mp[u] === true || mp[v] === true){
                        adj[u].push([v,INF]);
                        adj[v].push([u,INF]);
                    }
                    else{
                        adj[u].push([v,1]);
                        adj[v].push([u,1]);
                    }
                }
                    
                if(inBound(i+1,j)){
                    let u=board[i][j],v=board[i+1][j];
                    if(mp[u] === true || mp[v] === true){
                        adj[u].push([v,INF]);
                        adj[v].push([u,INF]);
                    }
                    else{
                        adj[u].push([v,1]);
                        adj[v].push([u,1]);
                    }
                } 
                
                if(inBound(i+1,j-1)){
                    let u=board[i][j],v=board[i+1][j-1];
                    if(mp[u] === true || mp[v] === true){
                        adj[u].push([v,INF]);
                        adj[v].push([u,INF]);
                    }
                    else{
                        adj[u].push([v,1]);
                        adj[v].push([u,1]);
                    }
                }
            }
        }
    }

    
    let ans = [];
    function getPath(){
        desti = destination.current;
        let y = 0;
        for(let i=0;i<path.length;i++){
            if(path[i][0][0] === desti){
                y=i;
                break;
            }
        }
        let prevValue = path[y][1][desti];
        while(y>=0){
            if(path[y][1][desti] !== prevValue ){
                desti = path[y][0][0];
                prevValue = path[y][1][desti];
                ans.push(desti);
            }
            y--;
        }
    }

    function exploreBoard(){
        let i = 0;
        let exploreInterval = setInterval(()=>{
            if(i >= explore.length-1)
                stop(exploreInterval);
            let exploreDom  = document.getElementById(explore[i]);
            exploreDom.style.backgroundColor = "#272f3d";
            i++;   
        },100);
    }
    

    function updateBtn(e){
        setBtn(e.target.id);
    }

    function clicked(e){
        if(btn == "btn-1"){
            // setSource(parseInt(e.target.id));
            source.current = parseInt(e.target.id);
            src = source.current;
            // console.log(getDiv.current.id);
            let srcDom = document.getElementById(e.target.id);
            srcDom.style.backgroundColor = "#5139b3";
            console.log(`source ${source.current}`);
        }
            

        if(btn == "btn-2"){
            // setDestination(parseInt(e.target.id));
            destination.current = parseInt(e.target.id);
            desti = destination.current;
            let destiDom = document.getElementById(e.target.id);
            destiDom.style.backgroundColor="#5139b3";
            console.log(`destination ${destination.current}`);
        }
            
        if(btn == "btn-3"){
            let a = e.target.id;
            mp[a] = true;
            let wallDom = document.getElementById(a);
            wallDom.style.backgroundColor = "#b3393d";
        }
 
    } 

    function Reset(){
        setBtn('');
        source.current = -1;
        destination.current = -1;
        dist = [];
        createEdges = [];
        ans = [];
        for(let i=0;i<36;i++){
            let resetNode = document.getElementById(i);
            resetNode.style.backgroundColor = "#39b386";
            resetNode.style.boxShadow = "none";
        }
        for(let i=0;i<n*n;i++){
            mp[i] = false;
        }
    }
   
    function stop(interval){
        clearInterval(interval);
    }

    function createPath(){
        let i =0;
            let pathInterval = setInterval(()=>{
                if(i>=ans.length-1)
                    stop(pathInterval);
                let elem = document.getElementById(ans[i]);
                elem.style.background = "cyan";
                elem.style.boxShadow = "0 0 5px cyan," +
                "0 0 25px cyan," + "0 0 50px cyan,"+ "0 0 100px cyan";
                i++;
            },500);
    }

    function start(){
        //Error Handling is remainig 
        if(source.current !== -1 && destination.current !== -1){
            createEdges();
            ans.push(destination.current);
            dijkstra(source.current);
            getPath();
            exploreBoard();
            console.log(explore.length);
            setTimeout(()=>{
                createPath();
            },100*explore.length);
        }
        else    
            console.log("please select source and destination");
        // source.current = -1;
        // destination.current= -1;
        
    }

    
    
    
    return(
        <div>
            <div className="center-div">
                <div className="container">
                    {/* <Node/> */}
                    {NODES.map(i=>(<Node data={i} btn={btn} click={clicked} className="manyNodes"/>))}
                </div>
            </div>
 
            <div className = "buttons-holder"> 
                <button onClick={updateBtn} id="btn-1" className='btns'>Source</button><button id="btn-2" className='btns' onClick={updateBtn}>Distination</button><button id="btn-3" className='btns' onClick={updateBtn}>Walls</button> <button className='btns' onClick={start}>Start</button><button className='btns' id="btn-4" onClick={Reset}>Restart</button>
            </div> 
        </div>
    );
}