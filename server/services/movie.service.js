export default class MovieService {
  /**
   * @type {neo4j.Driver}
   */
  driver

  /**
   * The constructor expects an instance of the Neo4j Driver, which will be
   * used to interact with Neo4j.
   *
   * @param {neo4j.Driver} driver
   */
  constructor(driver) {
    this.driver = driver
  }
  
  async getMovie() {
    console.log("getting movie")

    const session = this.driver.session()

    const res = await session.executeRead(
      tx => tx.run(
        `
          MATCH (m:Movie {title: 'The Matrix'})
          RETURN m AS movie
        `,
      )
    )

    const [first] = res.records
    const movie = first.get('movie')

    await session.close()

    console.log(movie)

    return movie
  }

}
