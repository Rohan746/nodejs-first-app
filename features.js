const gfName = "MrsRandom";
const gfName2 = "MrsRandom";
const gfName3 = "MrsRandom";

export default gfName; //A single file can only one default export

export { gfName2, gfName3 }; //To export multiple stuff

// Other way to do it is
// export const gfName2 = "MrsRandom";
// export const gfName3 = "MrsRandom";


export const generatePercent =() =>{
    return `${Math.random()*100}`
}