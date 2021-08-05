let paidBtn=document.getElementById('paid-btn')
let unpaidBtn=document.getElementById('unpaid-btn')
let paidTickets=document.querySelector('.paid-ticket')
let unpaidTickets=document.querySelector('.unpaid-ticket')
let tickets=document.querySelectorAll('.ticket-id')
let total=document.getElementById('total')
let prices=unpaidTickets.querySelectorAll('.price')
let payAllBtn=document.getElementById('payall-btn')
let payment=document.getElementById('payment')
let changeInfoBtn=document.getElementById('change-info-btn')
let closeInfo=document.querySelector('.close-info')
let personalInfo=document.querySelector('.personal-info')
let overlay=document.querySelector('.overlay')
let editAvatarBtn=document.getElementById('edit-avatar-btn')
let newAvatar=document.getElementById('new-avatar')

window.addEventListener('load',()=>{
    let sum=0
    prices.forEach((price)=>{
        sum+=Number(price.textContent)
    })

    total.textContent=sum
})
payAllBtn.addEventListener('click',()=>{
    let ticketIds=[]
    tickets.forEach((ticket)=>{
        ticketIds.push(ticket.textContent)
    })
    axios.post('/payment/payall',{ticketIds}).then((response)=>{      
            window.location.href='/personal'      
    }).catch((error)=>{ window.location.href='/personal'})
})
paidBtn.addEventListener('click',()=>{
    paidTickets.classList.remove('hidden')
    unpaidTickets.classList.add('hidden')
    payment.classList.add('hidden')
})
unpaidBtn.addEventListener('click',()=>{
    paidTickets.classList.add('hidden')
    unpaidTickets.classList.remove('hidden')
    payment.classList.remove('hidden')
})
changeInfoBtn.addEventListener('click',()=>{
    personalInfo.classList.remove('hidden')
    overlay.classList.remove('hidden')
})
closeInfo.addEventListener('click',()=>{
    personalInfo.classList.add('hidden')
    overlay.classList.add('hidden')
})
editAvatarBtn.addEventListener('click',(event)=>{
    event.preventDefault()
    newAvatar.classList.toggle('hidden')

})




