export function neighborParser (neighborData){
    let neighborsList = [];
    console.log(neighborData)
    for(let i = 0; i < neighborData.length; i++){
        neighborsList.push(neighborData[i]._fields[0])
    }
    console.log(neighborsList)
    return neighborsList;
}