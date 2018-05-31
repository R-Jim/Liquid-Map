package io.liquid.map.builder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/drawing")
public class drawingController {
    @GetMapping(value = "")
    @ResponseBody
    public ModelAndView getDrawingBoard(ModelAndView modelAndView) {
        modelAndView.setViewName("drawingBoard.html");
        return modelAndView;
    }
}
