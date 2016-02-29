var settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://rshiscores.dev/Development/scripts/proxy.php",
    "type": "POST",
    success: function(){},
    error: function(error){
        console.log("User could not be found.");
    }
};

$.ajax(settings)
    .done(function (response) {
        console.log("Finished retrieving stats");

        let stats = response.replace(/"/g,""); // Remove all quotation marks from resulting string
        stats = stats.split("\\n");  // Break response into array based on \n characters

        // Skills with name spaces
        let skills = ["Overall","Attack","Defence","Strength","Hitpoints","Ranged","Prayer","Magic","Cooking","Woodcutting","Fletching","Fishing","Firemaking","Crafting","Smithing","Mining","Herblore","Agility","Thieving","Slayer","Farming","Runecrafting","Hunter","Construction"];

        for(let section in stats){
            // Prepend the skill name with the skill and create a new Skill object with the data
            stats[section] = new Skill(separate(skills[section]+","+stats[section], ","));
        }

        function Skill([skill, rank, level, experience] = []){
            this.skill = skill;
            this.rank  = rank;
            this.level = level;
            this.experience = experience;

            if(this.level < 10) this.level = "0"+this.level;
        }

        function separate(string, separator){
            return string.split(separator);
        }

        stats = stats.filter(function(skill){
            return skill.experience !== undefined;
        });


        let $skills = $('.skills');

        stats.map(function(stat){
            $skills.append('<div class="skill ' + stat.skill + '""><div class="skill-image" data-skill="' + stat.skill + '"></div><div class="skill-level">' + stat.level + '</div></div>');
        });
    });