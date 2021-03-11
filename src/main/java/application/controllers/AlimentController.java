package application.controllers;

import application.Entities.Aliment;
import application.repositories.RepoAliments;
import application.utils.ServerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
Corespond to RepoAliments, it is used to manage all the possible aliments recognized and used with the fridge
 */
@RestController
@CrossOrigin
@RequestMapping("/aliments")
public class AlimentController {
    @Autowired
    RepoAliments repoAliments;

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> getById(@PathVariable Integer id){
        Aliment found = repoAliments.findAliment(id);
        if(found == null)
            return new ResponseEntity<String>("Aliment not found!", HttpStatus.NOT_FOUND);
        else
            return new ResponseEntity<Aliment>(found,HttpStatus.OK);
    }


    @RequestMapping(method = RequestMethod.POST)
    public Aliment addAliment(@RequestBody Aliment aliment){
        repoAliments.addAliment(aliment);
        return aliment;
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.PUT)
    public Aliment updateAliment(@RequestBody Aliment aliment){
        repoAliments.updateAliment(aliment);
        return aliment;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@PathVariable Integer id){
        try{
            repoAliments.removeAliment(id);
            return new ResponseEntity<Aliment>(HttpStatus.OK);
        }
        catch(ServerException e){
            return new ResponseEntity<String>(e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(method = RequestMethod.GET)
    public Aliment[] getAllAliments(){
        return repoAliments.getAllAliments();
    }

    @GetMapping(path = "/types")
    public String[] getAllTypes() {return repoAliments.getAllTypes();}

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String error(ServerException e){return e.getMessage();}


}
