import React from "react" ; 

if ( ! window.app ) { 
    window.app = {} 
}

// will create ability to globally change state of react hook components 
export function useState(init_state , id) { 
    // first create the normal hook 
    var [value , setter ] = React.useState(init_state)
    
    // then define a new setter function 
    function set(f) { 
        setter( f ( value ) ) 
    }

    window.app[id]  = { value , set }

    return [ value, setter ] 

}



