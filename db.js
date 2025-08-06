const mongoose = require('mongoose')
const dburl = 'mongodb+srv://sudheerkusume321:sudheer242543@cluster0.nfzmbqu.mongodb.net/fashionapp?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(dburl)
.then(() => {
    console.log('Database Connected');
})
.catch((err) => console.log(err))