const {Seat}=require('../models')

const addSeat=async(req,res)=>{
    const {name,price,type,showtimeId}=req.body
    await Seat.create({name,price,type,showtimeId,status:false})
    
}
const addSeats=async(params)=>{
    try{
     
        let {price,type,showtimeId}=params
        for(let x of ['a','b']){
            for(let y of [1,2,3,4,5,6]){
                let name=x+y
                await Seat.create({name,price,type,showtimeId,status:false})
            }
        }
        
    }catch(error){
        console.log(error)
    }}
    
const getAllSeat=async(req,res)=>{
    try{
        let showtimeId=req.params.showtimeId
        let seats=await Seat.findAll({where:{showtimeId}})
        res.json({seats})
    }catch(error){
        console.log(error)
    }
    
}

module.exports={addSeat,addSeats,getAllSeat}