let movieId=document.getElementById('movieId').textContent
let display=document.querySelector('.displayshowtime')
let tableBody =display.querySelector('tbody')
let btndates=document.getElementById('btndates')
let overlay=document.querySelector('.overlay')
let closeTrailer=document.querySelector('.close-trailer')
let showTrailer=document.getElementById('show-trailer')
let trailer=document.querySelector('.trailer')
let video=document.getElementById('iframe1')
let bookBtn=document.getElementById('book-ticket')
let tableSeat=document.querySelector('.show-seat')

//template
let showtimeTemplate=document.querySelector("#showtime-template").innerHTML
bookBtn.addEventListener('click',(event)=>{
    let seatIds=[]
    tableSeat.querySelectorAll('.yellow').forEach((seat)=>{
        seatIds.push(seat.id) 
    })
    axios.post('/bookticket',{seatIds}).then((response)=>{
       if(response.status==401){
        window.location.href="/login"
       }else if(response.status==200){
           window.location.href="/personal"
       }

    }).catch((error)=>console.log(error))
})
// select showtime

for (let x=0;x<6;x++){
    let btn=document.getElementById(`btndate${x}`)
    let time=Date.now()+x*86400000
    btn.textContent=moment(time).format("MMM Do YY")
    btn.addEventListener('click',()=>{
        tableBody.textContent=""
        axios.post('/showtime',{movie:movieId,date:moment(time)})
        .then((response)=>{
            let data=response.data.result
            console.log(data)
            data.forEach((item)=>{
                let html=Mustache.render(showtimeTemplate,{
                    cinema:item.cinema,
                    address:item.address,
                    showtime:item.showtime,
                    startTime:moment(item.startTime).format('LT')
                })
                tableBody.insertAdjacentHTML('beforeend',html )
                })       
                let showtimeBtns=document.querySelectorAll('.showtime-btn')
                showtimeBtns.forEach((btn)=>{
                    btn.addEventListener('click',()=>{
                        let showtimeId=btn.id.slice(8)
                        
                        tableSeat.querySelectorAll('tr').forEach((row)=>{
                            row.innerHTML=""
                        })
                        
                        let seats=data.find((item)=>item.showtime=showtimeId).seats
                        seats.forEach((seat)=>{
                            let rowName=seat.name.slice(0,1)
                                let row=document.getElementById(`row${rowName}`)
                                row.insertAdjacentHTML('beforeend',`<td><button class=${seat.status?'red':'white'} ${seat.status?"disabled":''} id=seat${seat.id}>${seat.name}</button></td>`)
                        })
                        tableSeat.querySelectorAll('.white').forEach((btn)=>{
                            btn.addEventListener('click',()=>{
                                btn.classList.toggle('white')
                                btn.classList.toggle('yellow')
                            })
                        })
                        
                })
        })
    }).catch((error)=>console.log(error))       
    })
}
//trailer handle
showTrailer.addEventListener('click',()=>{
    trailer.classList.remove('hidden')
    overlay.classList.remove('hidden')
})
closeTrailer.addEventListener('click',()=>{
    trailer.classList.add('hidden')
    overlay.classList.add('hidden')

})





