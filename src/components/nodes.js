import { useState } from "react";
export const Node = (props)=>{
    //    console.log(props.btn);
       
    return(
        <div className="item" id={props.data} onClick={props.click}>
            
        </div>
    );
}