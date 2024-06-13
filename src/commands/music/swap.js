import { ApplicationCommandOptionType } from "discord.js";
import {
  ErrorEmbed,
  SuccessEmbed,
  WarningEmbed,
} from "../../modules/Embeds.js";

export const data = {
  name: "swap",
  description: "Troque duas músicas de lugar na fila",
  options: [
    {
      name: "first",
      description: "Posição da primeira música",
      type: ApplicationCommandOptionType.Number,
      required: true,
      min_value: 1,
    },
    {
      name: "second",
      description: "Posição da segunda música",
      type: ApplicationCommandOptionType.Number,
      required: true,
      min_value: 1,
    },
  ],
  category: "music",
  queueOnly: true,
  validateVC: true,
};
export function execute(interaction, queue) {
  if (queue.size < 2) {
    return interaction.reply({
      ephemeral: true,
      embeds: [
        ErrorEmbed(
          "Quantidades de músicas insuficientes na fila para executar esse comando."
        ),
      ],
    });
  }

  const first = interaction.options.getNumber("first", true) - 1;
  const second = interaction.options.getNumber("second", true) - 1;

  if (first >= queue.size || second >= queue.size) {
    return interaction.reply({
      ephemeral: true,
      embeds: [WarningEmbed("Posições inválidas.")],
    });
  }

  if (first === second) {
    return interaction.reply({
      ephemeral: true,
      embeds: [WarningEmbed("As músicas já estão na posição desejada.")],
    });
  }

  const song1 = queue.tracks.at(first);
  const song2 = queue.tracks.at(second);

  queue.node.swap(first, second);

  return interaction.reply({
    embeds: [
      SuccessEmbed(
        `Trocou de posição as músicas \`${song1.title}\` e \`${song2.title}\`.`
      ),
    ],
  });
}
