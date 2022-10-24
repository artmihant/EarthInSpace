import { createStore } from 'vuex'

export default createStore({
  state: {
      current_planet: 'earth',
      planets: [],
  },
  getters: {
      currentPlanet: s => s.current_planet,
      planets: s => s.planets
  },
  mutations: {
      addPlanet(state, {name, color}){
          state.planets.push({name,color})
      },
      switchToPlanet(state, name){
          state.current_planet = name
      }
  },
})
