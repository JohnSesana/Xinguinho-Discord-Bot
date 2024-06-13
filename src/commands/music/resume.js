import { ErrorEmbed, SuccessEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "resume",
  description: "Resumir uma música pausada",
  category: "music",
  queueOnly: true,
  validateVC: true,
};
export function execute(interaction, queue) {
  if (queue.isPlaying())
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("A música não está pausada.")],
    });

  queue.node.resume();

  return interaction.reply({
    embeds: [SuccessEmbed("Música resumida.")],
  });
}
