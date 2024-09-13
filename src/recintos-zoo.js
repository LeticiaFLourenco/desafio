class RecintosZoo {
  constructor() {
    // Inicialização dos recintos disponíveis no zoológico.
    this.recintos = [
      {
        Recinto: 1,
        bioma: "savana",
        capacidade: 10,
        ocupados: 3,
        animal: "MACACO",
      },
      {
        Recinto: 2,
        bioma: "floresta",
        capacidade: 5,
        ocupados: 0,
        animal: null,
      },
      {
        Recinto: 3,
        bioma: ["savana", "rio"],
        capacidade: 7,
        ocupados: 1,
        animal: "GAZELA",
      },
      { Recinto: 4, bioma: "rio", capacidade: 8, ocupados: 0, animal: null },
      {
        Recinto: 5,
        bioma: "savana",
        capacidade: 9,
        ocupados: 3,
        animal: "LEAO",
      },
    ];

    // Define os animais, os biomas em que vivem e se são carnivoros ou não
    this.animais = {
      LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
      LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
      CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
      MACACO: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
      GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
      HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false },
    };
  }

  analisaRecintos(animal, quantidade) {
    const resultado = {
      erro: null,
      recintosViaveis: null,
    };

    // Validação de entrada
    if (!this.animais[animal]) {
      resultado.erro = "Animal inválido";
      return resultado;
    }

    if (quantidade <= 0) {
      resultado.erro = "Quantidade inválida";
      return resultado;
    }

    const tamanhoAnimal = this.animais[animal].tamanho;
    const biomasAnimal = this.animais[animal].biomas;
    const espacoNecessario = tamanhoAnimal * quantidade;

    // Verifica se há recintos viáveis
    const recintosViaveis = this.recintos
      .filter((recinto) => {
        // Verifica se o bioma do recinto é válido
        const biomaValido = Array.isArray(recinto.bioma)
          ? biomasAnimal.some((bioma) => recinto.bioma.includes(bioma))
          : biomasAnimal.includes(recinto.bioma);

        const espacoLivre = recinto.capacidade - recinto.ocupados;
        const espacoSuficiente = espacoLivre >= espacoNecessario;

        // Regra para carnívoros
        if (this.animais[animal].carnivoro) {
          if (recinto.animal !== null && recinto.animal !== animal) {
            return false; // Carnívoros só com a mesma espécie
          }
        } else if (
          recinto.animal !== null &&
          this.animais[recinto.animal].carnivoro
        ) {
          return false; // Não carnívoros não podem ficar com carnívoros
        }

        // Macacos precisam de companhia
        if (animal === "MACACO" && recinto.ocupados === 0 && quantidade === 1) {
          return false;
        }

        // Hipopótamo com outras espécies apenas em "savana e rio"
        if (animal === "HIPOPOTAMO" && recinto.ocupados > 0) {
          if (
            !Array.isArray(recinto.bioma) ||
            !recinto.bioma.includes("savana") ||
            !recinto.bioma.includes("rio")
          ) {
            return false;
          }
        }

        return biomaValido && espacoSuficiente;
      })
      .map((recinto) => {
        const espacoOcupado =
          recinto.ocupados *
          (recinto.animal ? this.animais[recinto.animal].tamanho : 1);
        const espacoLivre =
          recinto.capacidade - espacoOcupado - espacoNecessario;
        return {
          descricao: `Recinto ${recinto.Recinto} (espaço livre: ${espacoLivre} total: ${recinto.capacidade})`,
          espacoLivre: espacoLivre,
          recinto: recinto.Recinto,
        };
      })
      .sort((a, b) => {
        if (a.espacoLivre !== b.espacoLivre) {
          return b.espacoLivre - a.espacoLivre; // Ordena por espaço livre decrescente
        }
        return a.recinto - b.recinto; // Se espaço livre for igual, ordena por número do recinto
      })
      .map((item) => item.descricao);

    if (recintosViaveis.length === 0) {
      resultado.erro = "Não há recinto viável";
      resultado.recintosViaveis = null;
    } else {
      resultado.recintosViaveis = recintosViaveis;
    }

    return resultado;
  }
}

export { RecintosZoo as RecintosZoo };
