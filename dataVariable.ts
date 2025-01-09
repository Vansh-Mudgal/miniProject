
declare global {
    namespace NodeJS {
        interface Global {
            __pmsOptionData: any;
        }
    }
}

export enum DataVariableActions{
    OPTION_DATA,
    ALL,
}

export async function loadDataVariables(action:any= DataVariableActions.ALL){
    if(action == DataVariableActions.OPTION_DATA || action == DataVariableActions.ALL)
        {        
        
        }
      

    console.log("Data variable loaded successfully.")
}
