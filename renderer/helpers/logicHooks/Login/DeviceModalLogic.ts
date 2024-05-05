import secureLocalStorage from "react-secure-storage"

export const checkAccountState =async (locked, userData, setState, checkId) => {
    const deviceId = secureLocalStorage.getItem('deviceId')
    console.log(deviceId)
    if(locked){
        if(deviceId){
            // call check device id to check state 0 or 1
            checkAccountId(deviceId.toString(), checkId ,setState, userData)
        }else{
            setState(1)
            // state 1
        }
    }else{
        
        if(deviceId){
            setState(2)
            // state 2
        }else{
            setState(3)
            // state 3
        }
        
    }
}

const checkAccountId = async (deviceId: string, checkId, setState, userData)=>{
    await checkId(
        {deviceId, jwt: userData.jwt},
        {
            onSuccess: (response)=>{
                if(response.data === true){
                    setState(0)
                }
                else{
                    setState(1)
                }
            }
        }
    )
}

export const fetchLocked =async (jwt:string, checkLocked, setLocked) => {
    await checkLocked(
        {jwt},
        {
            onSuccess: (response)=>{
                console.log(response.data)
                setLocked(response.data)
            }
        }
    )
}