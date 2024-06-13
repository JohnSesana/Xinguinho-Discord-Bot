import { ErrorEmbed, SuccessEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "shuffle",
  description: "Ligar ordem aleatória de musicas da fila",
  category: "music",
  queueOnly: true,
  validateVC: true,
};

export function execute(interaction, queue) {
  if (queue.isEmpty())
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("A fila está vazia.")],
    });

  const mode = queue.toggleShuffle();

  return interaction.reply({
    embeds: [SuccessEmbed(`${mode ? "Enabled" : "Disabled"} modo shuffle.`)],
  });
}
