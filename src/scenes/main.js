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
            exploreDom.style.backgroundColor = "Yellow";
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
            srcDom.style.backgroundColor = "tomato";
            console.log(`source ${source.current}`);
        }
            

        if(btn == "btn-2"){
            // setDestination(parseInt(e.target.id));
            destination.current = parseInt(e.target.id);
            desti = destination.current;
            let destiDom = document.getElementById(e.target.id);
            destiDom.style.backgroundColor="tomato";
            console.log(`destination ${destination.current}`);
        }
            
        if(btn == "btn-3"){
            let a = e.target.id;
            mp[a] = true;
            let wallDom = document.getElementById(a);
            wallDom.style.backgroundColor = "red";
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
                elem.style.background = "blue";
                i++;
            },500);
    }

    function start(){
        //Error Handling is remainig 
        createEdges();
        ans.push(destination.current);
        dijkstra(source.current);
        getPath();
        exploreBoard();
        console.log(explore.length);
        setTimeout(()=>{
            createPath();
         },100*explore.length);
        
        // reversePath(ans);
        
        setBtn('');
        source.current = -1;
        destination.current= -1;
        mp.forEach((i)=>{
            i = false;
        });
    }

    
    
    
    return(
        <div>
            <div className="container">
                {/* <Node/> */}
                {NODES.map(i=>(<Node data={i} btn={btn} click={clicked} className="manyNodes"/>))}
            </div> 
            <div> <button onClick={updateBtn} id="btn-1">Source</button><button id="btn-2" onClick={updateBtn}>Distination</button><button id="btn-3" onClick={updateBtn}>Walls</button> <button onClick={start}>Start</button></div> 
        </div>
    );
}