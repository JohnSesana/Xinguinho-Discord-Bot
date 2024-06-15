import { ErrorEmbed, SuccessEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "pause",
  description: "Pausa a música atual",
  category: "music",
  queueOnly: true,
  validateVC: true,
};

export function execute(interaction, queue) {
  if (!queue.isPlaying())
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("A música já está pausada.")],
    });

  queue.node.pause();

  return interaction.reply({
    embeds: [SuccessEmbed("Música pausada.")],
  });
}
