const { error } = require('console')
const { supabase } = require('./client')
const { people, travelProducts, productImages } = require('./data')

// ====================================================
// DE SEED ALL THE TABLES
// ====================================================
const tables = ['people', 'travel_products', 'product_images']
async function deSeed() {
  for (const item of tables) {
    const { data, error } = await supabase.from(item).delete().neq('id', 0)
    console.log('table ' + item + ' deleted')
  }
}

// ====================================================
// MAIN SEEDER WITH DE SEED FIRST DEFAULT
// ====================================================
async function seed() {
  console.log('running seeder...')
  console.log()
  console.log('seeding people...')
  console.log()

  // ====================================================
  // SEED USERS AND GET THEIR IDS
  // ====================================================
  const userIds = new Map()
  for (const item of people) {
    const { data, error } = await supabase.from('people').insert(item).select()
    if (error) {
      console.error('Error seeding item:', error)
    }
    if (data) {
      console.log('seeded item: ', data[0].username)
      userIds.set(data[0].username, data[0].id)
    }
  }
  console.log('finished seeding users: ', userIds)

  // ====================================================
  // PREPARE / SEED PRODUCTS AND GET IDS FOR IAMGES
  // ====================================================
  console.log('preparing travel products')
  const productIds = new Map()
  const preparedProductsFroDB = travelProducts.map(
    ({ ownerTempRefId, id, tempRefId, ...item }, i) => ({
      ...item,
      temp_ref_id: tempRefId,
      owner_id: userIds.get(ownerTempRefId),
    })
  )

  for (const item of preparedProductsFroDB) {
    const { data, error } = await supabase
      .from('travel_products')
      .insert(item)
      .select()
    if (error) {
      console.log('Error seeding preparedProductsFroDB', error)
    }

    if (data) {
      console.log('success seeding ', data)
      productIds.set(data[0].temp_ref_id, data[0].id)
    }
  }
  console.log('success product ids map ', productIds)

  // ====================================================
  // PREPARE IAMGES DATA AND SEED -- LAST SEED
  // ====================================================
  const preparedImgageData = productImages.map(({ tempRefId, ...item }, i) => ({
    ...item,
    temp_ref_id: tempRefId,
    travel_product_id: productIds.get(tempRefId),
  }))

  console.log('seeding preparedImgageData')
  for (const item of preparedImgageData) {
    const { data, error } = await supabase
      .from('product_images')
      .insert(item)
      .select()

    if (error) {
      console.log('Error seeding images:', error)
    }

    if (data) {
      console.log('successfully inserted ', data[0].url)
    }
  }
  console.log('seeding completed')
}

// ====================================================
// START FUNCTION USING ARGS
// ====================================================

const args = process.argv[2]
async function start() {
  if (args === '--seed') {
    await deSeed()
    await seed()
  }

  if (args === '--clear') {
    await deSeed()
  }
}

start() 
